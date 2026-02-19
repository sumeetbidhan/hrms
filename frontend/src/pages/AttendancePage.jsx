import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceList from '../components/AttendanceList';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || err.message || 'Failed to load employees');
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [empRes, attRes] = await Promise.all([api.get('/employees'), api.get('/attendance')]);
      setEmployees(empRes.data.data || []);
      setAttendance(attRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleMarkAttendance = async (payload) => {
    setSubmitLoading(true);
    setError('');
    try {
      await api.post('/attendance', payload);
      await fetchAttendance();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = err.response?.data?.message || err.response?.data?.detail;
      setError(Array.isArray(msg) ? msg.map((d) => d.msg).join(', ') : msg || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredList = filterEmployeeId
    ? attendance.filter((r) => r.employee_employee_id === filterEmployeeId)
    : attendance;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Attendance</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Mark Attendance</h5>
          <ErrorAlert message={error} onDismiss={() => setError('')} />
          {employees.length === 0 ? (
            <p className="text-muted">Add employees first from the Employees page.</p>
          ) : (
            <AttendanceForm
              employees={employees}
              onSubmit={handleMarkAttendance}
              loading={submitLoading}
            />
          )}
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <h5 className="card-title mb-0">View attendance</h5>
            <select
              className="form-select form-select-sm w-auto"
              value={filterEmployeeId}
              onChange={(e) => setFilterEmployeeId(e.target.value)}
            >
              <option value="">All employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <Loader />
          ) : attendance.length === 0 ? (
            <EmptyState message="No attendance records yet." />
          ) : filteredList.length === 0 ? (
            <EmptyState message="No attendance for this employee." />
          ) : (
            <AttendanceList
              records={attendance}
              filterEmployeeId={filterEmployeeId || undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}

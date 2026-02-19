import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/employees');
      setEmployees(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAdd = async (payload) => {
    setSubmitLoading(true);
    setError('');
    try {
      await api.post('/employees', payload);
      await fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail;
      setError(Array.isArray(msg) ? msg.map((d) => d.msg).join(', ') : msg || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    setDeletingId(employeeId);
    setError('');
    try {
      await api.delete(`/employees/${employeeId}`);
      await fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || err.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Employees</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add Employee</h5>
          <ErrorAlert message={error} onDismiss={() => setError('')} />
          <EmployeeForm onSubmit={handleAdd} loading={submitLoading} />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Employee List</h5>
          {loading ? (
            <Loader />
          ) : employees.length === 0 ? (
            <EmptyState message="No employees yet. Add one above." />
          ) : (
            <EmployeeList employees={employees} onDelete={handleDelete} deletingId={deletingId} />
          )}
        </div>
      </div>
    </div>
  );
}

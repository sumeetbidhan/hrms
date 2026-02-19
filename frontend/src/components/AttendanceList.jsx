export default function AttendanceList({ records, filterEmployeeId }) {
  if (!records?.length) return null;

  const list = filterEmployeeId
    ? records.filter((r) => r.employee_employee_id === filterEmployeeId)
    : records;

  if (!list.length) return null;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.employee_employee_id}</td>
              <td>{r.employee_full_name}</td>
              <td>
                <span className={`badge ${r.status === 'Present' ? 'bg-success' : 'bg-secondary'}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

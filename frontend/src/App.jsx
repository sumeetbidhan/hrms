import { Routes, Route, Link } from 'react-router-dom';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            HRMS Lite
          </Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">
              Employees
            </Link>
            <Link className="nav-link" to="/attendance">
              Attendance
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<EmployeesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

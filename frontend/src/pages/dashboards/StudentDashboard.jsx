import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">EduSchool</h1>
          <p className="text-sm text-blue-100">Student Dashboard</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100"
        >
          Logout
        </button>
      </header>

      {/* Main */}
      <main className="p-6">

        {/* Welcome */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name || "Student"} 👋
          </h2>

          <p className="text-gray-600 mt-2">
            Manage your classes, attendance, results and fees from here.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Profile */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">👤</div>

            <h3 className="text-xl font-bold text-gray-800">
              My Profile
            </h3>

            <p className="text-gray-500 mt-2">
              View and manage your profile information.
            </p>

            <button
              onClick={() => navigate("/student/profile")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View Profile
            </button>
          </div>

          {/* Classes */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">📚</div>

            <h3 className="text-xl font-bold text-gray-800">
              My Classes
            </h3>

            <p className="text-gray-500 mt-2">
              View your classes and subjects.
            </p>

            <button
              onClick={() => navigate("/student/classes")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View Classes
            </button>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">📅</div>

            <h3 className="text-xl font-bold text-gray-800">
              Attendance
            </h3>

            <p className="text-gray-500 mt-2">
              Check your attendance records.
            </p>

            <button
              onClick={() => navigate("/student/attendance")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View Attendance
            </button>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">📊</div>

            <h3 className="text-xl font-bold text-gray-800">
              Results
            </h3>

            <p className="text-gray-500 mt-2">
              View your examination results.
            </p>

            <button
              onClick={() => navigate("/student/results")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View Results
            </button>
          </div>

          {/* Fees */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">💰</div>

            <h3 className="text-xl font-bold text-gray-800">
              Fees
            </h3>

            <p className="text-gray-500 mt-2">
              Check your fee details and payment status.
            </p>

            <button
              onClick={() => navigate("/student-fees")}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              View My Fees
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
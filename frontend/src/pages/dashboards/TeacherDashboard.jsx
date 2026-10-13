
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "teacher") {
        navigate("/");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const dashboardCards = [

    {
      title: "My Classes",
      description: "View the classes assigned to you.",
      icon: "🏫",
      path: "/teacher-classes",
    },

    {
      title: "Attendance",
      description: "Mark and view student attendance.",
      icon: "📋",
      path: "/teacher/attendance",
    },
    {
      title: "Student Results",
      description: "Add and view student marks and results.",
      icon: "📊",
      path: "/teacher-results",
    },
    {
      title: "View Student Results",
      description: "View a student's marks across subjects and exams.",
      icon: "📚",
      path: "/teacher-student-results",
    },
    {
      title: "Attendance Report",
      description: "View student attendance percentage and history.",
      icon: "📈",
      path: "/teacher-attendance-report",
    },

  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex flex-col gap-4 bg-blue-600 px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">EduSchool</h1>

        <div className="flex flex-wrap items-center gap-4">
          <span>
            Welcome, <strong>{user.name || "Teacher"}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="rounded-md bg-white px-4 py-2 font-semibold text-blue-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="p-6 md:p-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Teacher Dashboard
          </h2>

          <p className="text-gray-600">
            Manage your classes, students, attendance, and academic activities.
          </p>
        </div>

        {/* Teacher Information */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-xl font-semibold text-gray-800">
            Teacher Information
          </h3>

          <p className="text-gray-600">
            Name: {user.name || "Not available"}
          </p>

          <p className="text-gray-600">
            Email: {user.email || "Not available"}
          </p>

          <p className="text-gray-600">
            Role: Teacher
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => navigate(card.path)}
              className="rounded-lg bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="mb-3 text-4xl">{card.icon}</div>

              <h3 className="mb-2 text-xl font-semibold text-blue-600">
                {card.title}
              </h3>

              <p className="text-gray-600">{card.description}</p>

              <span className="mt-4 inline-block font-semibold text-blue-600">
                Open →
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;


import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
    classes: 0,
  });

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =================================
  // LOGOUT
  // =================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =================================
  // FETCH DASHBOARD STATS
  // =================================

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        studentsResponse,
        teachersResponse,
        parentsResponse,
        classesResponse,
      ] = await Promise.all([
        axios.get(
          "http://localhost:5000/api/students",
          config
        ),

        axios.get(
          "http://localhost:5000/api/teachers",
          config
        ),

        axios.get(
          "http://localhost:5000/api/users?role=parent",
          config
        ),

        axios.get(
          "http://localhost:5000/api/classes",
          config
        ),
      ]);

      setStats({
        students:
          studentsResponse.data.count ||
          studentsResponse.data.students?.length ||
          studentsResponse.data.length ||
          0,

        teachers:
          teachersResponse.data.count ||
          teachersResponse.data.teachers?.length ||
          teachersResponse.data.length ||
          0,

        parents:
          parentsResponse.data.count ||
          parentsResponse.data.users?.length ||
          parentsResponse.data.length ||
          0,

        classes:
          classesResponse.data.count ||
          classesResponse.data.classes?.length ||
          classesResponse.data.length ||
          0,
      });
    } catch (error) {
      console.error(
        "Dashboard stats error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =================================
  // DASHBOARD CARDS
  // =================================

  const cards = [
    {
      title: "Total Students",
      value: stats.students,
      icon: "🎓",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },

    {
      title: "Total Teachers",
      value: stats.teachers,
      icon: "👨‍🏫",
      bg: "bg-green-100",
      text: "text-green-600",
    },

    {
      title: "Total Parents",
      value: stats.parents,
      icon: "👨‍👩‍👧",
      bg: "bg-purple-100",
      text: "text-purple-600",
    },

    {
      title: "Total Classes",
      value: stats.classes,
      icon: "🏫",
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-8 text-white shadow-lg">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* Dashboard Title */}

          <div>
            <h1 className="text-3xl font-bold">
              EduSchool Admin Dashboard
            </h1>

            <p className="mt-2 text-blue-100">
              Manage your school from one place
            </p>
          </div>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="rounded-lg bg-white px-5 py-2.5 font-semibold text-red-600 shadow transition hover:bg-red-50"
          >
            Logout
          </button>

        </div>

      </div>


      {/* ================================= */}
      {/* MAIN CONTENT */}
      {/* ================================= */}

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ================================= */}
        {/* STATISTICS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <h2
                    className={`mt-2 text-3xl font-bold ${card.text}`}
                  >
                    {loading
                      ? "..."
                      : card.value}
                  </h2>

                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl ${card.bg}`}
                >
                  {card.icon}
                </div>

              </div>

            </div>
          ))}

        </div>


        {/* ================================= */}
        {/* QUICK MANAGEMENT */}
        {/* ================================= */}

        <div className="mt-10">

          <h2 className="mb-5 text-2xl font-bold text-gray-800">
            Quick Management
          </h2>


          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">


            {/* ============================= */}
            {/* STUDENTS */}
            {/* ============================= */}

            <button
              onClick={() =>
                navigate("/admin/students")
              }
              className="group rounded-2xl bg-white p-6 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🎓
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Students
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add and manage students
              </p>

              <p className="mt-4 font-semibold text-blue-600">
                Manage →
              </p>

            </button>


            {/* ============================= */}
            {/* TEACHERS */}
            {/* ============================= */}

            <button
              onClick={() =>
                navigate("/admin/teachers")
              }
              className="group rounded-2xl bg-white p-6 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                👨‍🏫
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Teachers
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage teacher records
              </p>

              <p className="mt-4 font-semibold text-green-600">
                Manage →
              </p>

            </button>


            {/* ============================= */}
            {/* CLASSES */}
            {/* ============================= */}

            <button
              onClick={() =>
                navigate("/admin/classes")
              }
              className="group rounded-2xl bg-white p-6 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                🏫
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Classes
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create and manage classes
              </p>

              <p className="mt-4 font-semibold text-orange-600">
                Manage →
              </p>

            </button>


            {/* ============================= */}
            {/* FEES */}
            {/* ============================= */}

            <button
              onClick={() =>
                navigate("/admin/fees")
              }
              className="group rounded-2xl bg-white p-6 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                💰
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Fees
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage student fees
              </p>

              <p className="mt-4 font-semibold text-purple-600">
                Manage →
              </p>

            </button>


            {/* ============================= */}
            {/* RESULTS */}
            {/* ============================= */}

            <button
              onClick={() =>
                navigate("/admin/results")
              }
              className="group rounded-2xl bg-white p-6 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-2xl">
                📊
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Results
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage marks and results
              </p>

              <p className="mt-4 font-semibold text-pink-600">
                Manage →
              </p>

            </button>


            {/* ============================= */}
            {/* NOTICES */}
            {/* ============================= */}

            <button
              onClick={() =>
                navigate("/admin/notices")
              }
              className="group rounded-2xl bg-white p-6 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                📢
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Notices
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create and manage notices
              </p>

              <p className="mt-4 font-semibold text-red-600">
                Manage →
              </p>

            </button>

          </div>

        </div>


        {/* ================================= */}
        {/* WELCOME SECTION */}
        {/* ================================= */}

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-md">

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Welcome to EduSchool 👋
              </h2>

              <p className="mt-2 max-w-2xl text-gray-500">
                Manage students, teachers, classes,
                fees, results and school notices from
                one simple dashboard.
              </p>

            </div>


            <button
              onClick={fetchDashboardStats}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
            >
              🔄 Refresh Data
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
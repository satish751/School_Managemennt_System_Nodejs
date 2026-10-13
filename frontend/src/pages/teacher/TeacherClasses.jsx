
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

function TeacherClasses() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
      fetchMyClasses(token);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const fetchMyClasses = async (token) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `${API}/classes/my-classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      const myClasses = Array.isArray(data?.classes)
        ? data.classes
        : Array.isArray(data)
          ? data
          : [];

      setClasses(myClasses);
    } catch (error) {
      console.error("FETCH TEACHER CLASSES ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load your classes."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Classes
            </h1>

            <p className="mt-2 text-gray-600">
              View your assigned classes and subjects.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/teacher-dashboard")}
            className="rounded-lg border border-blue-600 bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Teacher Information */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            Teacher Information
          </h2>

          <p className="text-gray-600">
            Name:{" "}
            <span className="font-medium text-gray-800">
              {user.name || "Teacher"}
            </span>
          </p>

          <p className="mt-2 text-gray-600">
            Email:{" "}
            <span className="font-medium text-gray-800">
              {user.email || "—"}
            </span>
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Total Subject Assignments</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {classes.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Unique Classes</p>
            <h2 className="mt-2 text-3xl font-bold text-cyan-600">
              {new Set(
                classes.map(
                  (item) => `${item.className}-${item.section}`
                )
              ).size}
            </h2>
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {errorMessage}

            <button
              type="button"
              onClick={() =>
                fetchMyClasses(localStorage.getItem("token"))
              }
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Assigned Classes */}
        <div className="overflow-x-auto rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Assigned Classes and Subjects
          </h2>

          {loading ? (
            <p className="text-gray-600">
              Loading your classes...
            </p>
          ) : classes.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <p className="text-4xl">📚</p>
              <p className="mt-3 font-semibold text-gray-700">
                No class assignments found.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Please ask the administrator to assign a class and subject.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead>
                <tr className="bg-blue-50 text-gray-700">
                  <th className="border p-3">Class</th>
                  <th className="border p-3">Section</th>
                  <th className="border p-3">Subject</th>
                  <th className="border p-3">Academic Year</th>
                  <th className="border p-3">Students</th>
                </tr>
              </thead>

              <tbody>
                {classes.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="border p-3 font-medium">
                      {item.className || "—"}
                    </td>

                    <td className="border p-3">
                      {item.section || "—"}
                    </td>

                    <td className="border p-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {item.subject || "—"}
                      </span>
                    </td>

                    <td className="border p-3">
                      {item.academicYear || "—"}
                    </td>

                    <td className="border p-3">
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/teacher/students", {
                            state: {
                              className: item.className,
                              section: item.section,
                              subject: item.subject,
                              academicYear: item.academicYear,
                            },
                          })
                        }
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        View Students →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default TeacherClasses;

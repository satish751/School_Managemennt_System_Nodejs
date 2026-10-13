
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentClasses() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [student, setStudent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMyClasses = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Please log in to view your classes.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/classes/my-classes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      const classList = Array.isArray(data?.classes)
        ? data.classes
        : Array.isArray(data)
          ? data
          : [];

      setClasses(classList);
      setStudent(data?.student || null);
    } catch (error) {
      console.error("My Classes Error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load classes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const studentName =
    student?.name ||
    student?.user?.name ||
    "Student";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-5 text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              🎓 EduSchool
            </h1>
            <p className="mt-1 text-blue-100">
              My Classes
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">

        {/* ERROR */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={fetchMyClasses}
              className="mt-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* STUDENT DETAILS */}
        {student && (
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {studentName}! 👋
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <p className="text-gray-600">
                Class:{" "}
                <span className="font-semibold text-gray-800">
                  {student.className || "N/A"}
                </span>
              </p>

              <p className="text-gray-600">
                Section:{" "}
                <span className="font-semibold text-gray-800">
                  {student.section || "N/A"}
                </span>
              </p>

              {student.admissionNumber && (
                <p className="text-gray-600">
                  Admission Number:{" "}
                  <span className="font-semibold text-gray-800">
                    {student.admissionNumber}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* SUBJECTS */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-800">
              My Subjects
            </h2>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {classes.length} subjects
            </span>
          </div>

          {classes.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <p className="text-4xl">📚</p>
              <p className="mt-3 font-medium text-gray-700">
                No classes or subjects found.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Please contact the school administrator if you think this is incorrect.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((schoolClass, index) => (
                <div
                  key={schoolClass._id || index}
                  className="rounded-xl border border-gray-200 p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                    📚
                  </div>

                  <h3 className="text-xl font-bold text-gray-800">
                    {schoolClass.subject || "Subject"}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      Class:{" "}
                      <span className="font-semibold text-gray-800">
                        {schoolClass.className || "N/A"}
                      </span>
                    </p>

                    <p>
                      Section:{" "}
                      <span className="font-semibold text-gray-800">
                        {schoolClass.section || "N/A"}
                      </span>
                    </p>

                    <p>
                      Academic Year:{" "}
                      <span className="font-semibold text-gray-800">
                        {schoolClass.academicYear || "N/A"}
                      </span>
                    </p>

                    <p>
                      Teacher:{" "}
                      <span className="font-semibold text-gray-800">
                        {schoolClass.classTeacher?.user?.name ||
                          schoolClass.classTeacher?.name ||
                          "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default StudentClasses;

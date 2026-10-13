
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentResults() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMyResults = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Please log in to view your results.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/results/my-results",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      const resultList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setResults(resultList);
    } catch (error) {
      console.error("Fetch student results error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load results. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResults();
  }, []);

  const getPercentage = (marks) => {
    const value = Number(marks);

    if (!Number.isFinite(value) || value < 0) {
      return "N/A";
    }

    // Assumes each subject is marked out of 100.
    return `${value.toFixed(1)}%`;
  };

  const getGrade = (marks) => {
    const value = Number(marks);

    if (!Number.isFinite(value) || value < 0 || value > 100) {
      return "N/A";
    }

    if (value >= 90) return "A+";
    if (value >= 80) return "A";
    if (value >= 70) return "B";
    if (value >= 60) return "C";
    if (value >= 50) return "D";
    if (value >= 35) return "Pass";

    return "Needs Improvement";
  };

  const averageMarks =
    results.length > 0
      ? (
          results.reduce(
            (total, result) => total + Number(result.marks || 0),
            0
          ) / results.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-5 text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              🎓 EduSchool
            </h1>
            <p className="mt-1 text-blue-100">
              My Examination Results
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

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* INTRODUCTION */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">
            My Results 📝
          </h2>
          <p className="mt-2 text-gray-600">
            View your marks, grades, and examination performance.
          </p>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {errorMessage}

            <button
              type="button"
              onClick={fetchMyResults}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-600 shadow-sm">
            Loading your results...
          </div>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Total Results
                </p>
                <h3 className="mt-2 text-3xl font-bold text-blue-600">
                  {results.length}
                </h3>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Average Marks
                </p>
                <h3 className="mt-2 text-3xl font-bold text-green-600">
                  {averageMarks}/100
                </h3>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Average Percentage
                </p>
                <h3 className="mt-2 text-3xl font-bold text-purple-600">
                  {averageMarks}%
                </h3>
              </div>

            </div>

            {/* RESULTS TABLE */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-gray-800">
                Result Details
              </h2>

              {results.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-10 text-center">
                  <p className="text-4xl">📝</p>
                  <p className="mt-3 font-semibold text-gray-700">
                    No results available yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your results will appear here when the school publishes them.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="border p-3">Subject</th>
                        <th className="border p-3">Class</th>
                        <th className="border p-3">Exam</th>
                        <th className="border p-3">Academic Year</th>
                        <th className="border p-3">Marks</th>
                        <th className="border p-3">Percentage</th>
                        <th className="border p-3">Grade</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((result) => (
                        <tr
                          key={result._id}
                          className="hover:bg-gray-50"
                        >
                          <td className="border p-3 font-medium text-gray-800">
                            {result.subject || "N/A"}
                          </td>

                          <td className="border p-3">
                            {result.className || "N/A"}
                          </td>

                          <td className="border p-3">
                            {result.examType || "N/A"}
                          </td>

                          <td className="border p-3">
                            {result.academicYear || "N/A"}
                          </td>

                          <td className="border p-3 font-semibold">
                            {result.marks ?? "N/A"}/100
                          </td>

                          <td className="border p-3">
                            {getPercentage(result.marks)}
                          </td>

                          <td className="border p-3">
                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                              {getGrade(result.marks)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default StudentResults;

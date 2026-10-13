
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ParentResults() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/results/parent/my-child",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudent(response.data.student);
        setResults(response.data.results || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load your child's results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const getGrade = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-blue-700">
        Loading results...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/parent-dashboard")}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-blue-700 shadow hover:bg-blue-100"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-blue-800">
            Child's Academic Results
          </h1>

          <p className="mt-2 text-gray-600">
            View your child's exam performance.
          </p>

          {student && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-semibold">{student.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Class & Section
                </p>
                <p className="font-semibold">
                  {student.className} - {student.section}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Admission Number
                </p>
                <p className="font-semibold">
                  {student.admissionNumber || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-xl bg-white p-6 text-red-600 shadow">
            {error}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h2 className="text-lg font-semibold text-gray-700">
              No Results Available
            </h2>
            <p className="mt-2 text-gray-500">
              Your child's results have not been published yet.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-gray-500">Total Subjects/Entries</p>
                <p className="mt-2 text-2xl font-bold text-blue-700">
                  {results.length}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-gray-500">Average Marks</p>
                <p className="mt-2 text-2xl font-bold text-green-700">
                  {(
                    results.reduce(
                      (total, result) => total + result.marks,
                      0
                    ) / results.length
                  ).toFixed(1)}
                  <span className="text-base font-normal"> / 100</span>
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-gray-500">Exams</p>
                <p className="mt-2 text-2xl font-bold text-purple-700">
                  {new Set(results.map((result) => result.examType)).size}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow">
              <div className="border-b p-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Results History
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-blue-100 text-blue-900">
                    <tr>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Exam</th>
                      <th className="p-4">Academic Year</th>
                      <th className="p-4">Marks</th>
                      <th className="p-4">Grade</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((result) => (
                      <tr
                        key={result._id}
                        className="border-b hover:bg-blue-50"
                      >
                        <td className="p-4 font-medium">
                          {result.subject}
                        </td>
                        <td className="p-4">{result.examType}</td>
                        <td className="p-4">{result.academicYear}</td>
                        <td className="p-4 font-semibold">
                          {result.marks}/100
                        </td>
                        <td className="p-4">
                          <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800">
                            {getGrade(result.marks)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ParentResults;
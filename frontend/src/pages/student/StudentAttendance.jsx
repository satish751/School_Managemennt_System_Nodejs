
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentAttendance() {
  const [student, setStudent] = useState(null);
  const [summary, setSummary] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/attendance/my-attendance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudent(response.data.student);
        setSummary(response.data.summary || {});
        setAttendance(response.data.attendance || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load attendance records."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [navigate]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Convert date into YYYY-MM-DD for comparison
  const getDateValue = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Filter attendance using selected date range
  const filteredAttendance = attendance.filter((record) => {
    const recordDate = getDateValue(record.date);

    if (!recordDate) return false;

    const matchesFromDate =
      !fromDate || recordDate >= fromDate;

    const matchesToDate =
      !toDate || recordDate <= toDate;

    return matchesFromDate && matchesToDate;
  });

  // Attendance status styling
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-700";

      case "absent":
        return "bg-red-100 text-red-700";

      case "late":
        return "bg-yellow-100 text-yellow-700";

      case "leave":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Clear date filters
  const clearDates = () => {
    setFromDate("");
    setToDate("");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <p className="text-lg font-semibold text-blue-700">
          Loading attendance...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/student-dashboard")}
          className="mb-5 font-semibold text-blue-700 hover:underline"
        >
          ← Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">
            My Attendance
          </h1>

          <p className="mt-2 text-gray-600">
            View your attendance summary and search daily records by date.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Student Information */}
        {student && (
          <div className="mb-6 rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Student Information
            </h2>

            <div className="grid gap-3 text-gray-600 sm:grid-cols-2">
              <p>
                Name:{" "}
                <strong className="text-gray-800">
                  {student.name || "—"}
                </strong>
              </p>

              <p>
                Admission No:{" "}
                <strong className="text-gray-800">
                  {student.admissionNumber || "—"}
                </strong>
              </p>

              <p>
                Class:{" "}
                <strong className="text-gray-800">
                  {student.className || "—"} - {student.section || "—"}
                </strong>
              </p>
            </div>
          </div>
        )}

        {/* Attendance Summary */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Classes"
            value={summary.totalClasses ?? 0}
            color="text-blue-700"
          />

          <SummaryCard
            title="Present"
            value={summary.present ?? 0}
            color="text-green-700"
          />

          <SummaryCard
            title="Absent"
            value={summary.absent ?? 0}
            color="text-red-700"
          />

          <SummaryCard
            title="Attendance Percentage"
            value={`${summary.attendancePercentage ?? 0}%`}
            color="text-purple-700"
          />
        </div>

        {/* Date-wise Search */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Search Attendance by Date
          </h2>

          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
            {/* From Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Clear Button */}
            <button
              type="button"
              onClick={clearDates}
              className="rounded-lg bg-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
            >
              Clear Dates
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing {filteredAttendance.length} of {attendance.length} records.
          </p>
        </div>

        {/* Attendance History Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <div className="border-b p-5">
            <h2 className="text-xl font-bold text-gray-800">
              Attendance History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record, index) => (
                    <tr
                      key={record._id || index}
                      className="border-b transition hover:bg-blue-50"
                    >
                      <td className="p-4">{index + 1}</td>

                      <td className="p-4">
                        {formatDate(record.date)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-8 text-center text-gray-500"
                    >
                      No attendance records found for the selected dates.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Summary Card
function SummaryCard({ title, value, color }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow transition hover:shadow-lg">
      <p className="text-sm text-gray-500">{title}</p>

      <p className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default StudentAttendance;

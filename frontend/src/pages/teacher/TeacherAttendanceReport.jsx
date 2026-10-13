
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TeacherAttendanceReport() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [from, setFrom] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-01`;
  });

  const [to, setTo] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [report, setReport] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false);

  const token = localStorage.getItem("token");

  const selectedClass = classes.find(
    (item) => item._id === selectedClassId
  );

  // Fetch teacher's assigned classes
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/classes/my-classes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.classes || response.data;
        const classList = Array.isArray(data) ? data : [];

        setClasses(classList);
      } catch (error) {
        console.error("FETCH CLASSES ERROR:", error);

        setMessage(
          error.response?.data?.message || "Unable to load classes."
        );
        setMessageType("error");
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [navigate, token]);

  // Generate attendance report
  const fetchReport = async () => {
    if (!selectedClass || !from || !to) {
      setMessage("Please select a class and date range.");
      setMessageType("error");
      return;
    }

    if (from > to) {
      setMessage("Start date cannot be after end date.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setReport([]);
    setHasGeneratedReport(false);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/attendance/report",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            className: selectedClass.className,
            section: selectedClass.section,
            from,
            to,
          },
        }
      );

      setReport(response.data.report || []);
      setHasGeneratedReport(true);

      setMessage(
        response.data.report?.length
          ? "Attendance report generated successfully."
          : "No students or attendance records found for this class."
      );

      setMessageType(
        response.data.report?.length ? "success" : "info"
      );
    } catch (error) {
      console.error("FETCH ATTENDANCE REPORT ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch attendance report."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Export report to CSV
  const exportToCSV = () => {
    if (report.length === 0) {
      setMessage("No attendance data available to export.");
      setMessageType("error");
      return;
    }

    const headers = [
      "Admission Number",
      "Student Name",
      "Present",
      "Absent",
      "Late",
      "Total Marked",
      "Attendance Percentage",
    ];

    const rows = report.map((student) => [
      student.admissionNumber,
      student.name,
      student.present,
      student.absent,
      student.late,
      student.totalMarked,
      `${student.attendancePercentage}%`,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `attendance-report-${from}-to-${to}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    setMessage("Attendance report exported successfully.");
    setMessageType("success");
  };

  // Summary calculations
  const totalPresent = report.reduce(
    (total, student) => total + (student.present || 0),
    0
  );

  const totalAbsent = report.reduce(
    (total, student) => total + (student.absent || 0),
    0
  );

  const totalLate = report.reduce(
    (total, student) => total + (student.late || 0),
    0
  );

  const totalMarked = report.reduce(
    (total, student) => total + (student.totalMarked || 0),
    0
  );

  const averagePercentage =
    report.length > 0
      ? Math.round(
          report.reduce(
            (total, student) =>
              total + (student.attendancePercentage || 0),
            0
          ) / report.length
        )
      : 0;

  const messageClasses = {
    success: "bg-green-50 text-green-700",
    error: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Attendance Report
            </h1>
            <p className="mt-2 text-gray-600">
              View student attendance and export reports.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/teacher/attendance")}
            className="rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-gray-800"
          >
            ← Back to Attendance
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-sm md:grid-cols-4">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Class & Section
            </label>

            <select
              value={selectedClassId}
              onChange={(event) => {
                setSelectedClassId(event.target.value);
                setReport([]);
                setHasGeneratedReport(false);
                setMessage("");
              }}
              disabled={loadingClasses}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
            >
              <option value="">
                {loadingClasses
                  ? "Loading classes..."
                  : "Select class"}
              </option>

              {classes.map((item) => (
                <option key={item._id} value={item._id}>
                  Class {item.className} - Section {item.section}
                  {item.subject ? ` - ${item.subject}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              From Date
            </label>

            <input
              type="date"
              value={from}
              max={to}
              onChange={(event) => {
                setFrom(event.target.value);
                setHasGeneratedReport(false);
              }}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              To Date
            </label>

            <input
              type="date"
              value={to}
              min={from}
              onChange={(event) => {
                setTo(event.target.value);
                setHasGeneratedReport(false);
              }}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={fetchReport}
              disabled={loading || loadingClasses}
              className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-5 rounded-lg p-4 ${
              messageClasses[messageType] || messageClasses.info
            }`}
          >
            {message}
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Students</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {report.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Present Records</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {totalPresent}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Absent Records</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {totalAbsent}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Average Attendance</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              {averagePercentage}%
            </h2>
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Student-wise Report
              </h2>

              {selectedClass && (
                <p className="mt-1 text-sm text-gray-500">
                  Class {selectedClass.className} - Section{" "}
                  {selectedClass.section}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={exportToCSV}
              disabled={!hasGeneratedReport || report.length === 0}
              className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ↓ Export CSV
            </button>
          </div>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Generating attendance report...
            </p>
          ) : !hasGeneratedReport ? (
            <p className="py-8 text-center text-gray-500">
              Select a class and date range, then click Generate Report.
            </p>
          ) : report.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No students found for the selected class.
            </p>
          ) : (
            <>
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="bg-blue-50 text-gray-700">
                    <th className="border p-3">#</th>
                    <th className="border p-3">Admission No.</th>
                    <th className="border p-3">Student Name</th>
                    <th className="border p-3">Present</th>
                    <th className="border p-3">Absent</th>
                    <th className="border p-3">Late</th>
                    <th className="border p-3">Total Marked</th>
                    <th className="border p-3">Attendance %</th>
                  </tr>
                </thead>

                <tbody>
                  {report.map((student, index) => (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="border p-3">{index + 1}</td>

                      <td className="border p-3">
                        {student.admissionNumber || "—"}
                      </td>

                      <td className="border p-3 font-medium">
                        {student.name || "—"}
                      </td>

                      <td className="border p-3 text-green-700">
                        {student.present}
                      </td>

                      <td className="border p-3 text-red-700">
                        {student.absent}
                      </td>

                      <td className="border p-3 text-yellow-700">
                        {student.late}
                      </td>

                      <td className="border p-3">
                        {student.totalMarked}
                      </td>

                      <td className="border p-3">
                        <span
                          className={`rounded-full px-3 py-1 font-semibold ${
                            student.attendancePercentage >= 75
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.attendancePercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="border p-3" colSpan={3}>
                      Total
                    </td>
                    <td className="border p-3">{totalPresent}</td>
                    <td className="border p-3">{totalAbsent}</td>
                    <td className="border p-3">{totalLate}</td>
                    <td className="border p-3">{totalMarked}</td>
                    <td className="border p-3">
                      {averagePercentage}%
                    </td>
                  </tr>
                </tfoot>
              </table>

              <p className="mt-4 text-sm text-gray-500">
                Attendance percentage is calculated from recorded
                attendance days. Late records are not counted as Present
                in this calculation.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherAttendanceReport;
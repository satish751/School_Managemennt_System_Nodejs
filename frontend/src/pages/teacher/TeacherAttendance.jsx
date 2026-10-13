
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TeacherAttendance() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch teacher's assigned classes
  useEffect(() => {
    const fetchClasses = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

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
        setClasses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("FETCH CLASSES ERROR:", error);
        setMessage(
          error.response?.data?.message || "Unable to load classes."
        );
      }
    };

    fetchClasses();
  }, [navigate, token]);

  // Fetch attendance for selected class and date
  useEffect(() => {
    if (!selectedClass || !selectedSection || !date || !token) {
      setStudents([]);
      setAttendance({});
      return;
    }

    const fetchAttendance = async () => {
      setLoading(true);
      setMessage("");

      try {
        const response = await axios.get(
          "http://localhost:5000/api/attendance/class",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              className: selectedClass,
              section: selectedSection,
              date,
            },
          }
        );

        const records = response.data.attendance || [];
        setStudents(records);

        const initialAttendance = {};
        records.forEach((student) => {
          initialAttendance[student._id] = student.status || "Present";
        });

        setAttendance(initialAttendance);
      } catch (error) {
        console.error("FETCH ATTENDANCE ERROR:", error);
        setStudents([]);
        setAttendance({});
        setMessage(
          error.response?.data?.message ||
            "Unable to fetch attendance."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedClass, selectedSection, date, token]);

  const handleClassChange = (value) => {
    const selected = classes.find((item) => item._id === value);

    setSelectedClass(selected?.className || "");
    setSelectedSection(selected?.section || "");
    setStudents([]);
    setAttendance({});
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  };

  const handleSave = async () => {
    if (!students.length) {
      setMessage("No students available to mark attendance.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        className: selectedClass,
        section: selectedSection,
        date,
        attendance: students.map((student) => ({
          studentId: student._id,
          status: attendance[student._id] || "Present",
        })),
      };

      const response = await axios.post(
        "http://localhost:5000/api/attendance/mark",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || "Attendance saved successfully.");
    } catch (error) {
      console.error("SAVE ATTENDANCE ERROR:", error);
      setMessage(
        error.response?.data?.message || "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter(
    (student) => attendance[student._id] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => attendance[student._id] === "Absent"
  ).length;

  const lateCount = students.filter(
    (student) => attendance[student._id] === "Late"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Attendance Management
            </h1>
            <p className="mt-2 text-gray-600">
              Mark and manage daily student attendance.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
          >
            Back
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-sm md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Assigned Class
            </label>
            <select
              value={
                classes.find(
                  (item) =>
                    item.className === selectedClass &&
                    item.section === selectedSection
                )?._id || ""
              }
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="">Select class and section</option>
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
              Attendance Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-lg bg-blue-50 p-4 text-blue-800">
            {message}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Present</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {presentCount}
            </h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Absent</p>
            <h2 className="mt-2 text-2xl font-bold text-red-600">
              {absentCount}
            </h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Late</p>
            <h2 className="mt-2 text-2xl font-bold text-yellow-600">
              {lateCount}
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Student Attendance
          </h2>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Loading students...
            </p>
          ) : !selectedClass ? (
            <p className="py-8 text-center text-gray-500">
              Please select a class first.
            </p>
          ) : students.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No students found in this class.
            </p>
          ) : (
            <>
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border p-3">#</th>
                    <th className="border p-3">Admission No.</th>
                    <th className="border p-3">Student Name</th>
                    <th className="border p-3">Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="border p-3">{index + 1}</td>
                      <td className="border p-3">
                        {student.admissionNumber}
                      </td>
                      <td className="border p-3 font-medium">
                        {student.name}
                      </td>
                      <td className="border p-3">
                        <select
                          value={attendance[student._id] || "Present"}
                          onChange={(e) =>
                            handleStatusChange(
                              student._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border p-2"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherAttendance;
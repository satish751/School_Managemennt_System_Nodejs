
import { useEffect, useState } from "react";
import axios from "axios";

function TeacherResults() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [filters, setFilters] = useState({
    className: "",
    section: "",
    subject: "",
    examType: "Unit Test",
    academicYear: "",
  });

  const [marks, setMarks] = useState({});
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingStudent, setSavingStudent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Load classes assigned to the logged-in teacher
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/classes/my-classes",
          { headers }
        );

        const assignedClasses = Array.isArray(response.data)
          ? response.data
          : response.data.classes ||
            response.data.myClasses ||
            response.data.data ||
            [];

        setClasses(assignedClasses);

        if (assignedClasses.length > 0) {
          const firstClass = assignedClasses[0];

          setFilters({
            className: firstClass.className || "",
            section: firstClass.section || "",
            subject: firstClass.subject || "",
            examType: "Unit Test",
            academicYear: firstClass.academicYear || "",
          });
        } else {
          setError("No classes are assigned to your teacher account.");
        }
      } catch (err) {
        console.error("Fetch classes error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load assigned classes."
        );
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // Get unique class assignments for the dropdown
  const classOptions = classes.filter(
    (item, index, array) =>
      array.findIndex(
        (other) =>
          other.className === item.className &&
          other.section === item.section &&
          other.subject === item.subject &&
          other.academicYear === item.academicYear
      ) === index
  );

  // Load students and their saved marks
  const fetchResults = async () => {
    if (
      !filters.className ||
      !filters.section ||
      !filters.subject ||
      !filters.academicYear ||
      !filters.examType
    ) {
      return;
    }

    try {
      setLoadingStudents(true);
      setError("");
      setMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/results/teacher/class",
        {
          headers,
          params: filters,
        }
      );

      const resultList = response.data.results || [];

      setStudents(resultList);

      const savedMarks = {};

      resultList.forEach((student) => {
        savedMarks[student.studentId] =
          student.marks === "" || student.marks === null
            ? ""
            : String(student.marks);
      });

      setMarks(savedMarks);
    } catch (err) {
      console.error("Fetch results error:", err);
      setStudents([]);
      setMarks({});
      setError(
        err.response?.data?.message ||
          "Failed to load students and results."
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (!loadingClasses && filters.className) {
      fetchResults();
    }
  }, [
    loadingClasses,
    filters.className,
    filters.section,
    filters.subject,
    filters.examType,
    filters.academicYear,
  ]);

  const handleClassChange = (event) => {
    const selected = classOptions.find(
      (item) => item._id === event.target.value
    );

    if (!selected) return;

    setFilters((previous) => ({
      ...previous,
      className: selected.className,
      section: selected.section,
      subject: selected.subject,
      academicYear: selected.academicYear,
    }));

    setStudents([]);
    setMarks({});
    setMessage("");
    setError("");
  };

  const handleMarksChange = (studentId, value) => {
    if (value !== "" && (!/^\d{1,3}$/.test(value))) {
      return;
    }

    if (value !== "" && Number(value) > 100) {
      return;
    }

    setMarks((previous) => ({
      ...previous,
      [studentId]: value,
    }));
  };

  const handleSave = async (student) => {
    const studentMarks = marks[student.studentId];

    if (
      studentMarks === "" ||
      studentMarks === undefined ||
      !Number.isFinite(Number(studentMarks)) ||
      Number(studentMarks) < 0 ||
      Number(studentMarks) > 100
    ) {
      setError(`Enter valid marks from 0 to 100 for ${student.name}.`);
      setMessage("");
      return;
    }

    try {
      setSavingStudent(student.studentId);
      setError("");
      setMessage("");

      await axios.post(
        "http://localhost:5000/api/results/teacher",
        {
          student: student.studentId,
          className: filters.className,
          section: filters.section,
          subject: filters.subject,
          marks: Number(studentMarks),
          examType: filters.examType,
          academicYear: filters.academicYear,
        },
        { headers }
      );

      setMessage(`Marks saved successfully for ${student.name}.`);

      // Refresh the saved marks
      await fetchResults();
    } catch (err) {
      console.error("Save result error:", err);
      setError(
        err.response?.data?.message ||
          `Failed to save marks for ${student.name}.`
      );
    } finally {
      setSavingStudent("");
    }
  };

  const handleSaveAll = async () => {
    const incomplete = students.find(
      (student) =>
        marks[student.studentId] === "" ||
        marks[student.studentId] === undefined
    );

    if (incomplete) {
      setError(`Please enter marks for ${incomplete.name} first.`);
      setMessage("");
      return;
    }

    for (const student of students) {
      await handleSave(student);
    }
  };

  if (loadingClasses) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading your assigned classes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            Teacher Dashboard
          </p>

          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Student Results
          </h1>

          <p className="mt-2 text-gray-500">
            Enter, update, and review student examination marks.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Exam Details
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Class / Section / Subject
              </label>

              <select
                value={
                  classOptions.find(
                    (item) =>
                      item.className === filters.className &&
                      item.section === filters.section &&
                      item.subject === filters.subject &&
                      item.academicYear === filters.academicYear
                  )?._id || ""
                }
                onChange={handleClassChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {classOptions.map((item) => (
                  <option key={item._id} value={item._id}>
                    Class {item.className}-{item.section} |{" "}
                    {item.subject} | {item.academicYear}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Exam Type
              </label>

              <select
                value={filters.examType}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    examType: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 outline-none focus:border-blue-500"
              >
                <option value="Unit Test">Unit Test</option>
                <option value="Mid Term">Mid Term</option>
                <option value="Final Exam">Final Exam</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Academic Year
              </label>

              <input
                type="text"
                value={filters.academicYear}
                readOnly
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-3 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Student table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Student Marks
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {students.length} student(s) found
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={
                loadingStudents ||
                students.length === 0 ||
                savingStudent !== ""
              }
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingStudent ? "Saving..." : "Save All Marks"}
            </button>
          </div>

          {loadingStudents ? (
            <div className="p-10 text-center text-gray-500">
              Loading students and results...
            </div>
          ) : students.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No students found for this class and section.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Admission No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Marks / 100
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {students.map((student, index) => (
                    <tr
                      key={student.studentId}
                      className="hover:bg-blue-50/50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.admissionNumber}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {student.name}
                      </td>

                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={marks[student.studentId] ?? ""}
                          onChange={(event) =>
                            handleMarksChange(
                              student.studentId,
                              event.target.value
                            )
                          }
                          placeholder="Enter marks"
                          className="w-32 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleSave(student)}
                          disabled={savingStudent !== ""}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {savingStudent === student.studentId
                            ? "Saving..."
                            : student.resultId
                              ? "Update"
                              : "Save"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherResults;

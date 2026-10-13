
import { useEffect, useState } from "react";
import axios from "axios";

function TeacherStudentResults() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Load teacher's assigned classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/classes/my-classes",
          { headers }
        );

        const data = response.data;
        const classList = Array.isArray(data)
          ? data
          : data.classes || data.myClasses || data.data || [];

        setClasses(classList);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load assigned classes."
        );
      }
    };

    fetchClasses();
  }, []);

  // Load students when class changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        setSelectedStudent("");
        setResults([]);
        setStudentDetails(null);
        return;
      }

      try {
        setError("");
        setStudents([]);
        setSelectedStudent("");
        setResults([]);
        setStudentDetails(null);

        const selected = classes.find(
          (item) => item._id === selectedClass
        );

        if (!selected) return;

        const response = await axios.get(
          "http://localhost:5000/api/students",
          { headers }
        );

        const data = response.data;
        const studentList = Array.isArray(data)
          ? data
          : data.students || data.data || [];

        const filtered = studentList.filter(
          (student) =>
            String(student.className) === String(selected.className) &&
            String(student.section) === String(selected.section)
        );

        setStudents(filtered);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load students."
        );
      }
    };

    fetchStudents();
  }, [selectedClass, classes]);

  // Load selected student's results
  const handleViewResults = async () => {
    if (!selectedStudent) {
      setError("Please select a student.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResults([]);
      setStudentDetails(null);

      const response = await axios.get(
        `http://localhost:5000/api/results/teacher/student/${selectedStudent}`,
        { headers }
      );

      setStudentDetails(response.data.student);
      setResults(response.data.results || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load student results."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalMarks = results.reduce(
    (total, result) => total + Number(result.marks || 0),
    0
  );

  const markedResults = results.filter(
    (result) => result.marks !== undefined && result.marks !== null
  );

  const average = markedResults.length
    ? (
        markedResults.reduce(
          (total, result) => total + Number(result.marks),
          0
        ) / markedResults.length
      ).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-900">
          Student Results
        </h1>

        <p className="mb-6 text-gray-600">
          Select your assigned class and a student to view their results.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-3">
          <div>
            <label className="mb-2 block font-semibold">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="">Choose class / section</option>
              {classes.map((item) => (
                <option key={item._id} value={item._id}>
                  Class {item.className} - Section {item.section} (
                  {item.subject}, {item.academicYear})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!selectedClass}
              className="w-full rounded-lg border p-3 disabled:bg-gray-100"
            >
              <option value="">Choose student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.admissionNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleViewResults}
              disabled={!selectedStudent || loading}
              className="w-full rounded-lg bg-blue-700 p-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading..." : "View Results"}
            </button>
          </div>
        </div>

        {studentDetails && (
          <>
            <div className="mb-6 rounded-xl bg-white p-6 shadow">
              <h2 className="mb-3 text-xl font-bold text-blue-900">
                {studentDetails.name}
              </h2>
              <div className="grid gap-2 text-gray-700 sm:grid-cols-2">
                <p>
                  <strong>Admission No:</strong>{" "}
                  {studentDetails.admissionNumber}
                </p>
                <p>
                  <strong>Class:</strong> {studentDetails.className} -{" "}
                  {studentDetails.section}
                </p>
              </div>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-gray-500">Subjects / Exam Records</p>
                <p className="mt-2 text-2xl font-bold text-blue-800">
                  {results.length}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-gray-500">Total Marks Obtained</p>
                <p className="mt-2 text-2xl font-bold text-green-700">
                  {totalMarks}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow">
                <p className="text-gray-500">Average Marks</p>
                <p className="mt-2 text-2xl font-bold text-purple-700">
                  {average}%
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl bg-white shadow">
              <table className="w-full text-left">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Exam</th>
                    <th className="p-4">Marks</th>
                    <th className="p-4">Academic Year</th>
                  </tr>
                </thead>

                <tbody>
                  {results.length > 0 ? (
                    results.map((result, index) => (
                      <tr
                        key={result._id}
                        className="border-b hover:bg-blue-50"
                      >
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 capitalize">
                          {result.subject}
                        </td>
                        <td className="p-4">{result.examType}</td>
                        <td className="p-4 font-semibold">
                          {result.marks} / 100
                        </td>
                        <td className="p-4">{result.academicYear}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-6 text-center text-gray-500"
                      >
                        No results found for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherStudentResults;

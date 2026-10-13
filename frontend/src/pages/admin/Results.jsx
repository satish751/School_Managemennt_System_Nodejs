
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    student: "",
    className: "",
    subject: "",
    marks: "",
    examType: "",
    academicYear: "",
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // GET ALL RESULTS
  const fetchResults = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/results",
        config
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
      console.error("Error fetching results:", error);
      setResults([]);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load results."
      );
    } finally {
      setLoading(false);
    }
  };

  // GET ALL STUDENTS
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students",
        config
      );

      const data = response.data;

      const studentList = Array.isArray(data)
        ? data
        : Array.isArray(data?.students)
        ? data.students
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setStudents(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load students."
      );
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    if (!token) {
      setErrorMessage("Please log in to manage results.");
      setLoading(false);
      return;
    }

    fetchResults();
    fetchStudents();
  }, []);

  // GET STUDENT NAME
  const getStudentName = (student) => {
    if (!student) return "N/A";

    if (typeof student === "string") {
      const foundStudent = students.find(
        (item) => item._id === student
      );

      return foundStudent?.name || "Student";
    }

    return (
      student.name ||
      student.fullName ||
      student.user?.name ||
      "N/A"
    );
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ADD / UPDATE RESULT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.student ||
      !formData.className.trim() ||
      !formData.subject.trim() ||
      formData.marks === "" ||
      !formData.examType ||
      !formData.academicYear.trim()
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const marks = Number(formData.marks);

    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
      setErrorMessage("Marks must be between 0 and 100.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const data = {
        ...formData,
        className: formData.className.trim(),
        subject: formData.subject.trim(),
        marks,
        academicYear: formData.academicYear.trim(),
      };

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/results/${editId}`,
          data,
          config
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/results",
          data,
          config
        );
      }

      alert(
        editId
          ? "Result updated successfully."
          : "Result added successfully."
      );

      resetForm();
      await fetchResults();
    } catch (error) {
      console.error("Error saving result:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save result. Check your backend API."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // EDIT RESULT
  const handleEdit = (result) => {
    setEditId(result._id);

    const studentId =
      typeof result.student === "string"
        ? result.student
        : result.student?._id || "";

    setFormData({
      student: studentId,
      className: result.className || "",
      subject: result.subject || "",
      marks: result.marks ?? "",
      examType: result.examType || "",
      academicYear: result.academicYear || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE RESULT
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this result?"
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");

      await axios.delete(
        `http://localhost:5000/api/results/${id}`,
        config
      );

      setResults((previous) =>
        previous.filter((result) => result._id !== id)
      );

      if (editId === id) {
        resetForm();
      }

      alert("Result deleted successfully.");
    } catch (error) {
      console.error("Error deleting result:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete result."
      );
    }
  };

  // RESET FORM
  const resetForm = () => {
    setEditId(null);

    setFormData({
      student: "",
      className: "",
      subject: "",
      marks: "",
      examType: "",
      academicYear: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER: TITLE LEFT, BUTTON RIGHT */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Results Management
            </h1>

            <p className="mt-2 text-gray-600">
              Manage student marks and examination results
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin-dashboard")}
            className="self-start rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 sm:self-auto"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {errorMessage}

            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                fetchResults();
                fetchStudents();
              }}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* RESULT FORM */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            {editId ? "Update Result" : "Add Result"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* STUDENT */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Student
              </label>

              <select
                name="student"
                value={formData.student}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Student</option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {getStudentName(student)} -{" "}
                    {student.admissionNumber ||
                      "No admission number"}
                  </option>
                ))}
              </select>

              {students.length === 0 && !loading && (
                <p className="mt-1 text-sm text-gray-500">
                  No students found. Add a student first.
                </p>
              )}
            </div>

            {/* CLASS */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Class
              </label>

              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="Example: 10th"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* SUBJECT */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Example: Mathematics"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* MARKS */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Marks (out of 100)
              </label>

              <input
                type="number"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                placeholder="Enter marks"
                min="0"
                max="100"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* EXAM TYPE */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Exam Type
              </label>

              <select
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Exam</option>
                <option value="Unit Test">Unit Test</option>
                <option value="Mid Term">Mid Term</option>
                <option value="Final Exam">Final Exam</option>
              </select>
            </div>

            {/* ACADEMIC YEAR */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Academic Year
              </label>

              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="Example: 2026-27"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* FORM BUTTONS */}
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : editId
                  ? "Update Result"
                  : "Add Result"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RESULTS TABLE */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            All Results ({results.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-3">Student</th>
                  <th className="border p-3">Class</th>
                  <th className="border p-3">Subject</th>
                  <th className="border p-3">Marks</th>
                  <th className="border p-3">Exam</th>
                  <th className="border p-3">Academic Year</th>
                  <th className="border p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-6 text-center text-gray-500"
                    >
                      Loading results...
                    </td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-6 text-center text-gray-500"
                    >
                      No results found.
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr key={result._id}>
                      <td className="border p-3">
                        {getStudentName(result.student)}
                      </td>

                      <td className="border p-3">
                        {result.className || "N/A"}
                      </td>

                      <td className="border p-3">
                        {result.subject || "N/A"}
                      </td>

                      <td className="border p-3">
                        {result.marks ?? "N/A"}/100
                      </td>

                      <td className="border p-3">
                        {result.examType || "N/A"}
                      </td>

                      <td className="border p-3">
                        {result.academicYear || "N/A"}
                      </td>

                      <td className="border p-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(result)}
                            className="rounded bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(result._id)
                            }
                            className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Results;

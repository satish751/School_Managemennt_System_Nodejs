
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const emptyForm = {
  className: "",
  section: "",
  subject: "",
  academicYear: "2026-27",
  classTeacher: "",
};

function Classes() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // FETCH CLASS ASSIGNMENTS AND TEACHERS
  const fetchData = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [classRes, teacherRes] = await Promise.all([
        axios.get(`${API}/classes`, getConfig()),
        axios.get(`${API}/teachers`, getConfig()),
      ]);

      setClasses(classRes.data.classes || []);

      const teacherData = teacherRes.data;
      setTeachers(
        Array.isArray(teacherData)
          ? teacherData
          : teacherData.teachers || teacherData.data || []
      );
    } catch (error) {
      console.error("LOAD CLASSES ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load class assignments or teachers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE FORM INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ADD / UPDATE CLASS SUBJECT ASSIGNMENT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setSaving(true);

    try {
      const payload = {
        className: formData.className.trim(),
        section: formData.section.trim(),
        subject: formData.subject.trim(),
        academicYear: formData.academicYear.trim(),
        classTeacher: formData.classTeacher,
      };

      if (editId) {
        await axios.put(
          `${API}/classes/${editId}`,
          payload,
          getConfig()
        );

        setSuccessMessage(
          "Class subject assignment updated successfully."
        );
      } else {
        await axios.post(
          `${API}/classes`,
          payload,
          getConfig()
        );

        setSuccessMessage(
          "Subject assigned to class successfully."
        );
      }

      setFormData(emptyForm);
      setEditId(null);

      await fetchData();
    } catch (error) {
      console.error("SAVE CLASS ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save class assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  // EDIT ASSIGNMENT
  const handleEdit = (item) => {
    setEditId(item._id);

    setFormData({
      className: item.className || "",
      section: item.section || "",
      subject: item.subject || "",
      academicYear: item.academicYear || "2026-27",
      classTeacher:
        typeof item.classTeacher === "string"
          ? item.classTeacher
          : item.classTeacher?._id || "",
    });

    setErrorMessage("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE ASSIGNMENT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class subject assignment?")) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.delete(`${API}/classes/${id}`, getConfig());

      setSuccessMessage(
        "Class subject assignment deleted successfully."
      );

      if (editId === id) {
        setEditId(null);
        setFormData(emptyForm);
      }

      await fetchData();
    } catch (error) {
      console.error("DELETE CLASS ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete class assignment."
      );
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setEditId(null);
    setFormData(emptyForm);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const getTeacherName = (teacher) => {
    if (!teacher) return "Not assigned";

    return (
      teacher.user?.name ||
      teacher.name ||
      teacher.user?.email ||
      "Teacher"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Class & Subject Management
            </h1>

            <p className="mt-2 text-gray-600">
              Assign subjects and teachers to a class and section.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin-dashboard")}
            className="shrink-0 rounded-lg border border-blue-600 bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
            {errorMessage}
          </div>
        )}

        {/* SUCCESS */}
        {successMessage && (
          <div className="mb-4 rounded-md bg-green-100 p-3 text-green-700">
            {successMessage}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg bg-white p-6 shadow"
        >
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            {editId ? "Edit Class Assignment" : "Assign Subject to Class"}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* CLASS */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Class *
              </label>

              <input
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
                placeholder="e.g. 6"
                className="w-full rounded-md border p-3"
              />
            </div>

            {/* SECTION */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Section *
              </label>

              <input
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                placeholder="e.g. A"
                className="w-full rounded-md border p-3"
              />
            </div>

            {/* SUBJECT */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Subject *
              </label>

              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g. Mathematics"
                className="w-full rounded-md border p-3"
              />
            </div>

            {/* ACADEMIC YEAR */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Academic Year *
              </label>

              <input
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                placeholder="2026-27"
                className="w-full rounded-md border p-3"
              />
            </div>

            {/* TEACHER */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Assign Teacher *
              </label>

              <select
                name="classTeacher"
                value={formData.classTeacher}
                onChange={handleChange}
                required
                className="w-full rounded-md border p-3"
              >
                <option value="">Choose a teacher</option>

                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {getTeacherName(teacher)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            This assignment applies to the selected class and section,
            not to an individual student.
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading || saving || teachers.length === 0}
              className="rounded-md bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editId
                  ? "Update Assignment"
                  : "Assign Subject"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>

          {!loading && teachers.length === 0 && (
            <p className="mt-3 text-sm text-red-600">
              No teachers found. Add a teacher in Teacher Management first.
            </p>
          )}
        </form>

        {/* ASSIGNMENTS TABLE */}
        <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Class Subject Assignments
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading assignments...</p>
          ) : classes.length === 0 ? (
            <p className="text-gray-500">
              No assignments found. Use the form above to assign a subject.
            </p>
          ) : (
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border p-3">Class</th>
                  <th className="border p-3">Section</th>
                  <th className="border p-3">Subject</th>
                  <th className="border p-3">Teacher</th>
                  <th className="border p-3">Academic Year</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {classes.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="border p-3">{item.className}</td>
                    <td className="border p-3">{item.section}</td>
                    <td className="border p-3">{item.subject}</td>
                    <td className="border p-3">
                      {getTeacherName(item.classTeacher)}
                    </td>
                    <td className="border p-3">{item.academicYear}</td>

                    <td className="border p-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
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

export default Classes;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    admissionNumber: "",
    className: "",
    section: "",
    dob: "",
    gender: "",
    address: "",
    parentName: "",
    parentPhone: "",
  });

  const [message, setMessage] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage("Failed to load students.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      admissionNumber: "",
      className: "",
      section: "",
      dob: "",
      gender: "",
      address: "",
      parentName: "",
      parentPhone: "",
    });

    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/students/${editId}`,
          formData
        );
        setMessage("Student updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/students", formData);
        setMessage("Student added successfully!");
      }

      resetForm();
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      setMessage(
        error.response?.data?.message || "Failed to save student."
      );
    }
  };

  const handleEdit = (student) => {
    setEditId(student._id);

    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      admissionNumber: student.admissionNumber || "",
      className: student.className || "",
      section: student.section || "",
      dob: student.dob
        ? new Date(student.dob).toISOString().split("T")[0]
        : "",
      gender: student.gender || "",
      address: student.address || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setMessage("Student deleted successfully!");
      fetchStudents();

      if (editId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      setMessage("Failed to delete student.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header and Back to Dashboard Button */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Student Management
            </h1>
            <p className="mt-1 text-gray-600">
              Add and manage student records
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin-dashboard")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-5 rounded-lg border border-blue-200 bg-white p-3 text-blue-700">
            {message}
          </div>
        )}

        {/* Student Form */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            {editId ? "Update Student" : "Add New Student"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Student Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Admission Number
                </label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  placeholder="Enter admission number"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Class
                </label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="e.g. Class 8"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Section
                </label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g. A"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder="Enter parent name"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Parent/Guardian Phone
                </label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  placeholder="Enter parent phone"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="mb-1 block font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  rows="3"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {editId ? "Update Student" : "Add Student"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Students List */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Student Records ({students.length})
          </h2>

          {students.length === 0 ? (
            <p className="py-6 text-center text-gray-500">
              No students found. Add your first student above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="bg-blue-100 text-gray-700">
                    <th className="p-3">Name</th>
                    <th className="p-3">Admission No.</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b transition hover:bg-blue-50"
                    >
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">
                        {student.admissionNumber}
                      </td>
                      <td className="p-3">{student.className}</td>
                      <td className="p-3">{student.section}</td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3">{student.phone}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(student)}
                            className="rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(student._id)}
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
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

export default Students;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Teachers() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [teacherUsers, setTeacherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const initialFormData = {
    user: "",
    employeeId: "",
    subject: "",
    qualification: "",
    dateOfJoining: "",
    gender: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // GET ALL TEACHERS
  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/teachers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("GET TEACHERS ERROR:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch teachers"
      );
    } finally {
      setLoading(false);
    }
  };

  // GET REGISTERED TEACHER USERS
  const fetchTeacherUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/users?role=teacher",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeacherUsers(response.data.users || []);
    } catch (error) {
      console.error("GET TEACHER USERS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchTeacherUsers();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // RESET FORM
  const resetForm = () => {
    setFormData(initialFormData);
    setEditId(null);
  };

  // ADD / UPDATE TEACHER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/teachers/${editId}`,
          formData,
          config
        );

        setSuccessMessage("Teacher updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/teachers",
          formData,
          config
        );

        setSuccessMessage("Teacher added successfully");
      }

      resetForm();
      setShowForm(false);
      await fetchTeachers();
      await fetchTeacherUsers();
    } catch (error) {
      console.error("SAVE TEACHER ERROR:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to save teacher"
      );
    }
  };

  // EDIT TEACHER
  const handleEdit = (teacher) => {
    setEditId(teacher._id);

    setFormData({
      user: teacher.user?._id || "",
      employeeId: teacher.employeeId || "",
      subject: teacher.subject || "",
      qualification: teacher.qualification || "",
      dateOfJoining: teacher.dateOfJoining
        ? teacher.dateOfJoining.substring(0, 10)
        : "",
      gender: teacher.gender || "",
      address: teacher.address || "",
    });

    setShowForm(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // DELETE TEACHER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/teachers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Teacher deleted successfully");
      setErrorMessage("");
      await fetchTeachers();
    } catch (error) {
      console.error("DELETE TEACHER ERROR:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to delete teacher"
      );
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-8">
        <h1 className="text-2xl font-bold text-blue-700">
          Loading Teachers...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Teacher Management
            </h1>

            <p className="mt-1 text-gray-600">
              Manage all registered teachers
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* BACK TO DASHBOARD */}
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard")}
              className="rounded-lg border border-blue-600 bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-100"
            >
              ← Back to Dashboard
            </button>

            {/* ADD TEACHER */}
            <button
              type="button"
              onClick={() => {
                if (showForm) {
                  resetForm();
                }

                setShowForm(!showForm);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {showForm ? "Close Form" : "+ Add Teacher"}
            </button>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {errorMessage}
          </div>
        )}

        {/* TEACHER FORM */}
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-2xl font-bold text-gray-800">
              {editId ? "Edit Teacher" : "Add New Teacher"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* SELECT TEACHER */}
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Select Teacher
                  </label>

                  <select
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    required
                    disabled={!!editId}
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">Select Teacher</option>

                    {teacherUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* EMPLOYEE ID */}
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Employee ID
                  </label>

                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="EMP001"
                    required
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* SUBJECT */}
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Mathematics"
                    required
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* QUALIFICATION */}
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Qualification
                  </label>

                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="M.Sc Mathematics"
                    required
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* DATE OF JOINING */}
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Date of Joining
                  </label>

                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* GENDER */}
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* ADDRESS */}
                <div className="md:col-span-2">
                  <label className="mb-2 block font-semibold text-gray-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter teacher address"
                    required
                    rows="3"
                    className="w-full rounded-lg border p-3"
                  />
                </div>
              </div>

              {/* FORM BUTTONS */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                >
                  {editId ? "Update Teacher" : "Add Teacher"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TEACHERS TABLE */}
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Qualification</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <tr
                    key={teacher._id}
                    className="border-b hover:bg-blue-50"
                  >
                    <td className="p-4">{teacher.employeeId}</td>
                    <td className="p-4">{teacher.user?.name || "-"}</td>
                    <td className="p-4">{teacher.user?.email || "-"}</td>
                    <td className="p-4">{teacher.user?.phone || "-"}</td>
                    <td className="p-4">{teacher.subject}</td>
                    <td className="p-4">{teacher.qualification}</td>
                    <td className="p-4 capitalize">{teacher.gender}</td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(teacher)}
                          className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(teacher._id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-8 text-center text-gray-500"
                  >
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Teachers;

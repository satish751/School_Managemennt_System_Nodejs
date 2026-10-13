
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Fees() {
  const navigate = useNavigate();

  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    student: "",
    amount: "",
    dueDate: "",
    status: "pending",
    paymentDate: "",
  });

  const token = localStorage.getItem("token");

  // COMMON API CONFIG
  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // EXTRACT ARRAY SAFELY FROM API RESPONSE
  const getArray = (data, key) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  // GET ALL FEES
  const fetchFees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fees",
        getConfig()
      );

      setFees(getArray(response.data, "fees"));
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching fees:", error);
      setFees([]);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load fees. Please check the backend API."
      );
    }
  };

  // GET ALL STUDENTS
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students",
        getConfig()
      );

      setStudents(getArray(response.data, "students"));
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  // LOAD DATA
  useEffect(() => {
    if (!token) {
      setErrorMessage("Please log in to access fee management.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);

      try {
        await Promise.all([fetchFees(), fetchStudents()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // RESET FORM
  const resetForm = () => {
    setEditId(null);

    setFormData({
      student: "",
      amount: "",
      dueDate: "",
      status: "pending",
      paymentDate: "",
    });
  };

  // ADD / UPDATE FEE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const data = {
        student: formData.student,
        amount: Number(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status,
        paymentDate:
          formData.status === "paid" && formData.paymentDate
            ? formData.paymentDate
            : null,
      };

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/fees/${editId}`,
          data,
          getConfig()
        );

        alert("Fee updated successfully.");
      } else {
        await axios.post(
          "http://localhost:5000/api/fees",
          data,
          getConfig()
        );

        alert("Fee added successfully.");
      }

      resetForm();
      await fetchFees();
    } catch (error) {
      console.error("Error saving fee:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to save fee. Please check the form and backend."
      );
    }
  };

  // EDIT FEE
  const handleEdit = (fee) => {
    setEditId(fee._id);

    setFormData({
      student:
        typeof fee.student === "string"
          ? fee.student
          : fee.student?._id || "",
      amount: fee.amount ?? "",
      dueDate: fee.dueDate
        ? fee.dueDate.substring(0, 10)
        : "",
      status: fee.status || "pending",
      paymentDate: fee.paymentDate
        ? fee.paymentDate.substring(0, 10)
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE FEE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fee?"
    );

    if (!confirmDelete) return;

    try {
      setErrorMessage("");

      await axios.delete(
        `http://localhost:5000/api/fees/${id}`,
        getConfig()
      );

      alert("Fee deleted successfully.");
      await fetchFees();
    } catch (error) {
      console.error("Error deleting fee:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to delete fee."
      );
    }
  };

  // GET STUDENT NAME
  const getStudentName = (student) => {
    if (!student) return "N/A";

    if (typeof student === "string") {
      return student;
    }

    return (
      student.name ||
      student.user?.name ||
      student.fullName ||
      "N/A"
    );
  };

  // GET ADMISSION NUMBER
  const getAdmissionNumber = (student) => {
    if (!student || typeof student === "string") {
      return "N/A";
    }

    return student.admissionNumber || "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER AND DASHBOARD BUTTON */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Fees Management
            </h1>

            <p className="mt-2 text-gray-600">
              Manage student fees and payments
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

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {/* FEE FORM */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            {editId ? "Update Fee" : "Add Fee"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* STUDENT */}
            <div>
              <label
                htmlFor="student"
                className="mb-2 block font-medium text-gray-700"
              >
                Student
              </label>

              <select
                id="student"
                name="student"
                value={formData.student}
                onChange={handleChange}
                required
                className="w-full rounded border p-3"
              >
                <option value="">Select Student</option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {getStudentName(student)} -{" "}
                    {getAdmissionNumber(student)}
                  </option>
                ))}
              </select>

              {students.length === 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  No students loaded. Check the students API.
                </p>
              )}
            </div>

            {/* AMOUNT */}
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block font-medium text-gray-700"
              >
                Fee Amount (₹)
              </label>

              <input
                id="amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
                min="0.01"
                step="0.01"
                className="w-full rounded border p-3"
              />
            </div>

            {/* DUE DATE */}
            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block font-medium text-gray-700"
              >
                Due Date
              </label>

              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full rounded border p-3"
              />
            </div>

            {/* STATUS */}
            <div>
              <label
                htmlFor="status"
                className="mb-2 block font-medium text-gray-700"
              >
                Payment Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded border p-3"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* PAYMENT DATE */}
            <div>
              <label
                htmlFor="paymentDate"
                className="mb-2 block font-medium text-gray-700"
              >
                Payment Date
              </label>

              <input
                id="paymentDate"
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                disabled={formData.status !== "paid"}
                required={formData.status === "paid"}
                className="w-full rounded border p-3 disabled:bg-gray-100"
              />
            </div>

            {/* FORM BUTTONS */}
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                {editId ? "Update Fee" : "Add Fee"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* FEES TABLE */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            All Fees
          </h2>

          {loading ? (
            <p className="py-6 text-center text-gray-500">
              Loading fee records...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border p-3">Student</th>
                    <th className="border p-3">Admission No.</th>
                    <th className="border p-3">Amount</th>
                    <th className="border p-3">Due Date</th>
                    <th className="border p-3">Status</th>
                    <th className="border p-3">Payment Date</th>
                    <th className="border p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {fees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="p-6 text-center text-gray-500"
                      >
                        No fees found
                      </td>
                    </tr>
                  ) : (
                    fees.map((fee) => (
                      <tr key={fee._id}>
                        <td className="border p-3">
                          {getStudentName(fee.student)}
                        </td>

                        <td className="border p-3">
                          {getAdmissionNumber(fee.student)}
                        </td>

                        <td className="border p-3">
                          ₹{fee.amount}
                        </td>

                        <td className="border p-3">
                          {fee.dueDate
                            ? new Date(
                                fee.dueDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td className="border p-3">
                          <span
                            className={`rounded-full px-3 py-1 text-sm ${
                              fee.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {fee.status || "pending"}
                          </span>
                        </td>

                        <td className="border p-3">
                          {fee.paymentDate
                            ? new Date(
                                fee.paymentDate
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="border p-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(fee)}
                              className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(fee._id)}
                              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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
          )}
        </div>

      </div>
    </div>
  );
}

export default Fees;

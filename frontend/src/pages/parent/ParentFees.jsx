
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ParentFees() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({
    totalFees: 0,
    paidFees: 0,
    pendingFees: 0,
    overdueFees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view fee details.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/fees/parent/my-child",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudent(response.data.student);
        setFees(response.data.fees || []);
        setSummary(
          response.data.summary || {
            totalFees: 0,
            paidFees: 0,
            pendingFees: 0,
            overdueFees: 0,
          }
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load fee details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-blue-700">
        Loading fee details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/parent-dashboard")}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-blue-700 shadow hover:bg-blue-100"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-blue-800">
            School Fees
          </h1>

          <p className="mt-2 text-gray-600">
            View your child's fee payments and outstanding balance.
          </p>

          {student && (
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">
                  Student Name
                </p>
                <p className="font-semibold text-gray-800">
                  {student.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Class & Section
                </p>
                <p className="font-semibold text-gray-800">
                  {student.className} - {student.section}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Admission Number
                </p>
                <p className="font-semibold text-gray-800">
                  {student.admissionNumber || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-xl bg-white p-6 text-red-600 shadow">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border-l-4 border-blue-500 bg-white p-5 shadow">
                <p className="text-sm text-gray-500">
                  Total Fees
                </p>
                <p className="mt-2 text-xl font-bold text-blue-700">
                  {formatAmount(summary.totalFees)}
                </p>
              </div>

              <div className="rounded-xl border-l-4 border-green-500 bg-white p-5 shadow">
                <p className="text-sm text-gray-500">
                  Amount Paid
                </p>
                <p className="mt-2 text-xl font-bold text-green-700">
                  {formatAmount(summary.paidFees)}
                </p>
              </div>

              <div className="rounded-xl border-l-4 border-yellow-500 bg-white p-5 shadow">
                <p className="text-sm text-gray-500">
                  Pending Balance
                </p>
                <p className="mt-2 text-xl font-bold text-yellow-700">
                  {formatAmount(summary.pendingFees)}
                </p>
              </div>

              <div className="rounded-xl border-l-4 border-red-500 bg-white p-5 shadow">
                <p className="text-sm text-gray-500">
                  Overdue Fees
                </p>
                <p className="mt-2 text-xl font-bold text-red-700">
                  {formatAmount(summary.overdueFees)}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow">
              <div className="border-b p-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Fee Payment History
                </h2>
              </div>

              {fees.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-semibold text-gray-700">
                    No fee records found
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Fee details will appear here when the school adds them.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-blue-100 text-blue-900">
                      <tr>
                        <th className="p-4">#</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {fees.map((fee, index) => {
                        const overdue =
                          fee.status === "pending" &&
                          new Date(fee.dueDate).setHours(0, 0, 0, 0) <
                            new Date().setHours(0, 0, 0, 0);

                        return (
                          <tr
                            key={fee._id}
                            className="border-b hover:bg-blue-50"
                          >
                            <td className="p-4">{index + 1}</td>
                            <td className="p-4">
                              {formatDate(fee.dueDate)}
                            </td>
                            <td className="p-4 font-semibold">
                              {formatAmount(fee.amount)}
                            </td>
                            <td className="p-4">
                              {formatDate(fee.paymentDate)}
                            </td>
                            <td className="p-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  fee.status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : overdue
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {fee.status === "paid"
                                  ? "Paid"
                                  : overdue
                                    ? "Overdue"
                                    : "Pending"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ParentFees;
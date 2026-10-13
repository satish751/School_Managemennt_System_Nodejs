
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyFees() {
  const navigate = useNavigate();

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyFees = async () => {
      if (!token) {
        setErrorMessage("Please log in to view your fees.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/fees/my-fees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFees(response.data.fees || []);
      } catch (error) {
        console.error("Error fetching fees:", error);

        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load your fee records."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyFees();
  }, [token]);

  const totalFees = fees.reduce(
    (total, fee) => total + Number(fee.amount || 0),
    0
  );

  const paidFees = fees
    .filter((fee) => fee.status === "paid")
    .reduce((total, fee) => total + Number(fee.amount || 0), 0);

  const pendingFees = fees
    .filter((fee) => fee.status === "pending")
    .reduce((total, fee) => total + Number(fee.amount || 0), 0);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "-";

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Fees
            </h1>
            <p className="mt-2 text-gray-600">
              View your fee details and payment status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            className="rounded-lg border border-blue-600 bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
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
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Total Fees
            </p>
            <h2 className="mt-2 text-2xl font-bold text-blue-700">
              {formatAmount(totalFees)}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Paid Fees
            </p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {formatAmount(paidFees)}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Pending Fees
            </p>
            <h2 className="mt-2 text-2xl font-bold text-orange-600">
              {formatAmount(pendingFees)}
            </h2>
          </div>
        </div>

        {/* FEE TABLE */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Fee History
          </h2>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Loading your fees...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border p-3">S.No.</th>
                    <th className="border p-3">Amount</th>
                    <th className="border p-3">Due Date</th>
                    <th className="border p-3">Status</th>
                    <th className="border p-3">Payment Date</th>
                  </tr>
                </thead>

                <tbody>
                  {fees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-gray-500"
                      >
                        No fee records found.
                      </td>
                    </tr>
                  ) : (
                    fees.map((fee, index) => (
                      <tr key={fee._id} className="hover:bg-gray-50">
                        <td className="border p-3">
                          {index + 1}
                        </td>

                        <td className="border p-3 font-medium">
                          {formatAmount(Number(fee.amount || 0))}
                        </td>

                        <td className="border p-3">
                          {formatDate(fee.dueDate)}
                        </td>

                        <td className="border p-3">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              fee.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {fee.status === "paid" ? "Paid" : "Pending"}
                          </span>
                        </td>

                        <td className="border p-3">
                          {formatDate(fee.paymentDate)}
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

export default MyFees;
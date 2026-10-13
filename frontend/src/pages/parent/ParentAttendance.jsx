
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ParentAttendance() {
    const navigate = useNavigate();

    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        try {
            const user = JSON.parse(storedUser);

            if (user.role !== "parent") {
                navigate("/");
                return;
            }
        } catch {
            localStorage.removeItem("user");
            navigate("/login");
            return;
        }

        const fetchAttendance = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/attendance/parent/my-child",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load attendance."
                    );
                }

                setAttendance(data);
            } catch (err) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [navigate]);

    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        return Number.isNaN(parsedDate.getTime())
            ? "N/A"
            : parsedDate.toLocaleDateString();
    };

    const getStatusStyle = (status) => {
        switch (String(status).toLowerCase()) {
            case "present":
                return "bg-green-100 text-green-700";
            case "absent":
                return "bg-red-100 text-red-700";
            case "late":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-600">
                Loading attendance records...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <button
                    type="button"
                    className="mb-5 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => {
                        window.location.href = "/parent-dashboard";
                    }}
                >
                    ← Back to Dashboard
                </button>

                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                    <h2 className="font-semibold">
                        Unable to load attendance
                    </h2>
                    <p className="mt-1">{error}</p>
                </div>
            </div>
        );
    }

    const student = attendance?.student;
    const summary = attendance?.summary;
    const records = attendance?.records || [];

    const summaryCards = [
        {
            label: "Total Classes",
            value: summary?.totalClasses ?? 0,
            style: "bg-blue-50 text-blue-700",
        },
        {
            label: "Present",
            value: summary?.present ?? 0,
            style: "bg-green-50 text-green-700",
        },
        {
            label: "Absent",
            value: summary?.absent ?? 0,
            style: "bg-red-50 text-red-700",
        },
        {
            label: "Late",
            value: summary?.late ?? 0,
            style: "bg-yellow-50 text-yellow-700",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="mx-auto max-w-6xl">
                <button
                    onClick={() => navigate("/parent-dashboard")}
                    className="mb-5 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                    ← Back to Dashboard
                </button>

                <div className="mb-6 rounded-xl bg-white p-6 shadow">
                    <h1 className="text-2xl font-bold text-blue-700">
                        Child Attendance
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Attendance records for your child.
                    </p>

                    {student && (
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <p>
                                <span className="text-gray-500">Student: </span>
                                <strong>{student.name}</strong>
                            </p>

                            <p>
                                <span className="text-gray-500">
                                    Admission No:{" "}
                                </span>
                                <strong>
                                    {student.admissionNumber || "N/A"}
                                </strong>
                            </p>

                            <p>
                                <span className="text-gray-500">Class: </span>
                                <strong>
                                    {student.className || "N/A"}
                                    {student.section
                                        ? ` - ${student.section}`
                                        : ""}
                                </strong>
                            </p>
                        </div>
                    )}
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {summaryCards.map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-xl p-5 shadow ${card.style}`}
                        >
                            <p className="text-sm font-medium">{card.label}</p>
                            <p className="mt-2 text-3xl font-bold">
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mb-6 rounded-xl bg-white p-6 shadow">
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Attendance Percentage
                        </h2>

                        <span className="text-2xl font-bold text-blue-700">
                            {summary?.attendancePercentage ?? 0}%
                        </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{
                                width: `${Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        Number(summary?.attendancePercentage) || 0
                                    )
                                )}%`,
                            }}
                        />
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Late arrivals are counted as attended for this percentage.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <div className="border-b p-5">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Attendance History
                        </h2>
                    </div>

                    {records.length === 0 ? (
                        <p className="p-6 text-gray-600">
                            No attendance records found for your child yet.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-5 py-4">Date</th>
                                        <th className="px-5 py-4">Class</th>
                                        <th className="px-5 py-4">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {records.map((record) => (
                                        <tr
                                            key={record._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4">
                                                {formatDate(record.date)}
                                            </td>

                                            <td className="px-5 py-4">
                                                {record.className || student?.className || "N/A"}
                                                {record.section || student?.section
                                                    ? ` - ${record.section || student?.section}`
                                                    : ""}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 font-semibold capitalize ${getStatusStyle(
                                                        record.status
                                                    )}`}
                                                >
                                                    {record.status || "Unknown"}
                                                </span>
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

export default ParentAttendance;

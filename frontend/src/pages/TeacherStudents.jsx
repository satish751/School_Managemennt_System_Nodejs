
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function TeacherStudents() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            if (!state?.className || !state?.section) {
                setErrorMessage("Please select a class first.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:5000/api/classes/students",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            className: state.className,
                            section: state.section,
                            subject: state.subject,
                            academicYear: state.academicYear,
                        },
                    }
                );

                setStudents(response.data.students || []);
            } catch (error) {
                console.error("FETCH STUDENTS ERROR:", error);

                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load students."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [navigate, state]);

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Class Students
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Class: {state?.className || "—"} |
                            Section: {state?.section || "—"}
                        </p>

                        <p className="mt-1 text-gray-600">
                            Subject: {state?.subject || "—"}
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        ← Back to My Classes
                    </button>
                </div>

                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-gray-500">
                        Total Students
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-blue-600">
                        {students.length}
                    </h2>
                </div>

                {errorMessage && (
                    <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
                        {errorMessage}
                    </div>
                )}

                <div className="overflow-x-auto rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-xl font-bold text-gray-800">
                        Student List
                    </h2>

                    {loading ? (
                        <p className="text-gray-600">Loading students...</p>
                    ) : students.length === 0 ? (
                        <div className="rounded-lg bg-gray-50 p-8 text-center">
                            <p className="text-4xl">🎓</p>
                            <p className="mt-3 font-semibold text-gray-700">
                                No students found in this class.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full min-w-[650px] border-collapse text-left">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="border p-3">#</th>
                                    <th className="border p-3">Student Name</th>
                                    <th className="border p-3">Admission Number</th>
                                    <th className="border p-3">Email</th>
                                    <th className="border p-3">Phone</th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.map((student, index) => (
                                    <tr
                                        key={student._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="border p-3">{index + 1}</td>
                                        <td className="border p-3 font-medium">
                                            {student.name || student.fullName || "—"}
                                        </td>
                                        <td className="border p-3">
                                            {student.admissionNumber || "—"}
                                        </td>
                                        <td className="border p-3">
                                            {student.email || "—"}
                                        </td>
                                        <td className="border p-3">
                                            {student.phone || "—"}
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

export default TeacherStudents;

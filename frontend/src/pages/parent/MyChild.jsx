
import { useEffect, useState } from "react";
import axios from "axios";

function MyChild() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/students/parent/my-child",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudent(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to fetch student details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChild();
  }, []);

  if (loading) {
    return <p className="p-6">Loading student details...</p>;
  }

  if (error) {
    return (
      <div className="m-6 rounded-lg bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (!student) {
    return <p className="p-6">No student details found.</p>;
  }

  const details = [
    ["Name", student.name],
    ["Admission Number", student.admissionNumber],
    ["Class", student.className],
    ["Section", student.section],
    ["Email", student.email],
    ["Phone", student.phone],
    ["Date of Birth", student.dob?.slice(0, 10)],
    ["Gender", student.gender],
    ["Address", student.address],
    ["Parent Name", student.parentName],
    ["Parent Phone", student.parentPhone],
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold text-blue-800">
          My Child
        </h1>

        <p className="mb-6 text-gray-500">
          View your child's school profile.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 p-4"
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-1 font-semibold text-gray-800">
                {value || "Not available"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyChild;

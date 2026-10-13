import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentProfile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/students/my-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudent(response.data);
      } catch (error) {
        console.error("Profile Error:", error);

        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load student profile."
        );
      }
    };

    fetchProfile();
  }, []);

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">EduSchool</h1>
            <p className="text-sm text-blue-100">
              Student Profile
            </p>
          </div>

          <button
            onClick={() => navigate("/student-dashboard")}
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Profile */}
      <main className="max-w-5xl mx-auto p-6">

        <div className="bg-white rounded-lg shadow-md p-6">

          {/* Student Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {student.name}
              </h2>

              <p className="text-gray-500">
                Student
              </p>
            </div>
          </div>

          {/* Personal Details */}
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Name
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Phone
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.phone}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Admission Number
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.admissionNumber}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Class
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.className}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Section
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.section}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Date of Birth
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {new Date(student.dob).toLocaleDateString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Gender
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.gender}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Address
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.address}
              </div>
            </div>

          </div>

          {/* Parent Details */}
          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">
            Parent Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Parent Name
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.parentName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Parent Phone
              </label>

              <div className="border rounded-md px-4 py-2 bg-gray-50">
                {student.parentPhone}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default StudentProfile;
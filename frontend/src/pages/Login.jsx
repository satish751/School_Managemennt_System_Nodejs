
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful:", user);

      if (user.role === "student") {
        navigate("/student-dashboard");
      }else if (user.role === "teacher") {
        navigate("/teacher-dashboard");
      }else if (user.role === "admin") {
        navigate("/admin-dashboard");
      }else if (user.role === "parent") {
        navigate("/parent-dashboard");
      }

    } catch (error) {
      console.error("Login Error:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          EduSchool Login
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Error Message */}
          {errorMessage && (
            <p
              role="alert"
              className="mb-4 text-sm text-red-600"
            >
              {errorMessage}
            </p>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Signup Option */}
        <p className="mt-5 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;



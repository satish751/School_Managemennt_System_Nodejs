
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const [notices, setNotices] = useState([]);

  // Fetch notices
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notices"
      );

      setNotices(response.data.notices || []);
    } catch (error) {
      console.error("Fetch notices error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ================= SCHOOL NOTICES ================= */}
      <section className="bg-blue-400 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center gap-4">

            <div className="font-bold whitespace-nowrap">
              📢 School Notices
            </div>

            <div className="h-6 w-px bg-blue-300"></div>

            <div className="overflow-hidden flex-1">
              {notices.length === 0 ? (
                <p className="text-blue-100">
                  No new notices available.
                </p>
              ) : (
                <div className="flex gap-8 overflow-x-auto">
                  {notices.map((notice) => (
                    <div
                      key={notice._id}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      <span className="font-semibold">
                        {notice.title}
                      </span>

                      <span className="text-black">
                        - {notice.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ================= HERO SECTION ================= */}
      <section className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-20">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div>
              <p className="text-blue-600 font-semibold mb-3">
                Welcome to EduSchool
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Empowering Students
                <span className="text-blue-600">
                  {" "}Through Quality Education
                </span>
              </h1>

              <p className="mt-6 text-gray-600 text-lg">
                Manage students, teachers, classes, attendance and exam
                results from one simple platform.
              </p>

              <div className="mt-8 flex gap-4">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Get Started
                </Link>

                <Link
                  to="/about"
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-10 text-center w-full max-w-md">

                <div className="text-7xl mb-6">
                  🏫
                </div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Smart School Management
                </h2>

                <p className="text-gray-500 mt-3">
                  Everything your school needs in one place.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold text-gray-800">
              Why Choose EduSchool?
            </h2>

            <p className="text-gray-500 mt-3">
              Simple tools to manage everyday school activities.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Feature 1 */}
            <div className="bg-white border rounded-xl p-8 text-center shadow-sm hover:shadow-md">

              <div className="text-5xl mb-5">
                👨‍🏫
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                Expert Teachers
              </h3>

              <p className="text-gray-500 mt-3">
                Manage teachers and their assigned classes easily.
              </p>

            </div>

            {/* Feature 2 */}
            <div className="bg-white border rounded-xl p-8 text-center shadow-sm hover:shadow-md">

              <div className="text-5xl mb-5">
                📚
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                Quality Education
              </h3>

              <p className="text-gray-500 mt-3">
                Organize classes, subjects and student information.
              </p>

            </div>

            {/* Feature 3 */}
            <div className="bg-white border rounded-xl p-8 text-center shadow-sm hover:shadow-md">

              <div className="text-5xl mb-5">
                📊
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                Track Results
              </h3>

              <p className="text-gray-500 mt-3">
                Manage attendance, marks and student performance.
              </p>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;

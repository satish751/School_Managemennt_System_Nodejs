
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="min-h-screen bg-white">
        <Navbar />
      {/* Hero */}
      <section className="bg-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">

          <p className="font-semibold text-blue-600">
            About EduSchool
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-800 md:text-5xl">
            Making School Management
            <span className="text-blue-600"> Simple & Smart</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
            EduSchool is a simple school management system designed to
            help schools manage students, teachers, classes, attendance,
            fees and results from one platform.
          </p>

        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* Left */}
            <div>
              <div className="mb-6 text-7xl">
                🏫
              </div>

              <h2 className="text-3xl font-bold text-gray-800">
                About Our Platform
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                EduSchool provides a centralized platform for managing
                everyday school activities. Administrators can manage
                students, teachers, classes, fees, results and notices.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                Teachers can view students, manage attendance and enter
                marks, while students and parents can easily view
                academic information.
              </p>

            </div>

            {/* Right */}
            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-2xl bg-blue-50 p-6 text-center">
                <div className="text-4xl">🎓</div>
                <h3 className="mt-3 font-bold text-gray-800">
                  Students
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Easy student management
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-6 text-center">
                <div className="text-4xl">👨‍🏫</div>
                <h3 className="mt-3 font-bold text-gray-800">
                  Teachers
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage teacher records
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-6 text-center">
                <div className="text-4xl">📊</div>
                <h3 className="mt-3 font-bold text-gray-800">
                  Results
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Track student performance
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-6 text-center">
                <div className="text-4xl">💰</div>
                <h3 className="mt-3 font-bold text-gray-800">
                  Fees
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage school fees
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-800">
            Our Mission
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Our mission is to make school administration easier by
            bringing important school activities into one simple,
            organized and user-friendly platform.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            Contact Us →
          </Link>

        </div>
      </section>
        <Footer />
    </div>
  );
}

export default About;

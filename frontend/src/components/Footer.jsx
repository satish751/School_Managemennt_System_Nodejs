
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* School Info */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400">
              EduSchool
            </h2>

            <p className="mt-4 text-gray-400 leading-6">
              A simple and smart school management platform
              for students, teachers, parents and administrators.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              <Link
                to="/"
                className="text-gray-400 hover:text-blue-400"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="text-gray-400 hover:text-blue-400"
              >
                About
              </Link>

              <Link
                to="/login"
                className="text-gray-400 hover:text-blue-400"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="text-gray-400 hover:text-blue-400"
              >
                Sign Up
              </Link>

            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Services
            </h3>

            <div className="flex flex-col gap-3">

              <p className="text-gray-400">
                Student Management
              </p>

              <p className="text-gray-400">
                Teacher Management
              </p>

              <p className="text-gray-400">
                Class Management
              </p>

              <p className="text-gray-400">
                Results & Attendance
              </p>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <p>
                📍 Ranchi, Jharkhand, India
              </p>

              <p>
                📧 info@eduschool.com
              </p>

              <p>
                📞 +91 98765 43210
              </p>

            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 mt-10 pt-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-3">

            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} EduSchool. All rights reserved.
            </p>

            <p className="text-gray-500 text-sm">
              School Management System
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;


import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 shadow-md">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-600 text-2xl shadow-md">
              🏫
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Edu<span className="text-blue-600">School</span>
              </h1>

              <p className="text-xs text-white">
                Smart School Management
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">

            <Link
              to="/"
              className="font-medium text-white hover:text-blue-600 transition"
            >
              Home
            </Link>

            <Link
              to="/contact"
              className="font-medium text-white hover:text-blue-600 transition"
            >
              Contact
            </Link>

            <Link
              to="/about"
              className="font-medium text-white hover:text-blue-600 transition"
            >
              About
            </Link>

            <Link
              to="/login"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
            >
              Login
            </Link>

          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-lg p-2 text-2xl text-gray-700 hover:bg-gray-100"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 py-5 md:hidden">

            <div className="flex flex-col gap-4">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                🏠 Home
              </Link>

              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                📞 Contact
              </Link>

              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                ℹ️ About
              </Link>

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                🔐 Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Get Started →
              </Link>

            </div>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;

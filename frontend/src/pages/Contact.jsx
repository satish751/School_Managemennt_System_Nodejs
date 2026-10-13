
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Thank you! Your message has been submitted.");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-white">
        <Navbar />
      {/* Header */}
      <section className="bg-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">

          <p className="font-semibold text-blue-600">
            Get In Touch
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-800 md:text-5xl">
            Contact
            <span className="text-blue-600"> EduSchool</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Have a question or need help? Send us a message and
            our team will get back to you.
          </p>

        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">

          <div className="grid gap-10 md:grid-cols-2">

            {/* Contact Information */}
            <div>

              <h2 className="text-3xl font-bold text-gray-800">
                Let's Talk
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                We are here to help with any questions about the
                EduSchool platform.
              </p>

              <div className="mt-8 space-y-5">

                <div className="flex items-start gap-4 rounded-xl bg-blue-50 p-5">
                  <div className="text-3xl">
                    📍
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Address
                    </h3>

                    <p className="mt-1 text-gray-500">
                      Ranchi, Jharkhand, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl bg-blue-50 p-5">
                  <div className="text-3xl">
                    📧
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Email
                    </h3>

                    <p className="mt-1 text-gray-500">
                      info@eduschool.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl bg-blue-50 p-5">
                  <div className="text-3xl">
                    📞
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Phone
                    </h3>

                    <p className="mt-1 text-gray-500">
                      +91 98765 43210
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Contact Form */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border">

              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-5">
                  <label className="mb-2 block font-semibold text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label className="mb-2 block font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Subject */}
                <div className="mb-5">
                  <label className="mb-2 block font-semibold text-gray-700">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Message */}
                <div className="mb-5">
                  <label className="mb-2 block font-semibold text-gray-700">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message"
                    rows="5"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
                >
                  Send Message →
                </button>

              </form>

            </div>

          </div>

        </div>
      </section>
    <Footer />
    </div>
  );
}

export default Contact;
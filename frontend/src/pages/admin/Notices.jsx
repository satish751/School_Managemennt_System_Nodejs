
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notices() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  // COMMON API CONFIG
  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // GET ALL NOTICES
  const fetchNotices = async () => {
    try {
      setErrorMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/notices",
        getConfig()
      );

      const data = response.data;

      const noticeList = Array.isArray(data)
        ? data
        : Array.isArray(data?.notices)
        ? data.notices
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setNotices(noticeList);
    } catch (error) {
      console.error("Fetch notices error:", error);

      setNotices([]);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load notices. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    if (!token) {
      setErrorMessage("Please log in to manage notices.");
      setLoading(false);
      return;
    }

    fetchNotices();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ADD NOTICE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      setErrorMessage(
        "Please enter both the title and description."
      );
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      await axios.post(
        "http://localhost:5000/api/notices",
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
        },
        getConfig()
      );

      setFormData({
        title: "",
        description: "",
      });

      await fetchNotices();

      alert("Notice added successfully.");
    } catch (error) {
      console.error("Add notice error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to add notice. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE NOTICE
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");

      await axios.delete(
        `http://localhost:5000/api/notices/${id}`,
        getConfig()
      );

      setNotices((previous) =>
        previous.filter((notice) => notice._id !== id)
      );

      alert("Notice deleted successfully.");
    } catch (error) {
      console.error("Delete notice error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete notice."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-7 text-white shadow">
        <div className="mx-auto max-w-7xl">

          {/* TITLE LEFT, BUTTON RIGHT */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold">
                📢 Notice Management
              </h1>

              <p className="mt-2 text-blue-100">
                Create and manage school notices
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin-dashboard")}
              className="self-start rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30 sm:self-auto"
            >
              ← Back to Dashboard
            </button>
          </div>

        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {errorMessage}

            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                fetchNotices();
              }}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* ADD NOTICE FORM */}
          <div className="rounded-2xl bg-white p-6 shadow-md">

            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Add New Notice
            </h2>

            <form onSubmit={handleSubmit}>

              {/* NOTICE TITLE */}
              <div className="mb-5">
                <label
                  htmlFor="title"
                  className="mb-2 block font-semibold text-gray-700"
                >
                  Notice Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter notice title"
                  required
                  maxLength={150}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mb-5">
                <label
                  htmlFor="description"
                  className="mb-2 block font-semibold text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter notice details"
                  rows={6}
                  required
                  maxLength={5000}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* PUBLISH BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Publishing..."
                  : "📢 Publish Notice"}
              </button>

            </form>
          </div>

          {/* NOTICE LIST */}
          <div className="rounded-2xl bg-white p-6 shadow-md">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                All Notices
              </h2>

              <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
                {notices.length}
              </span>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-500">
                Loading notices...
              </div>
            ) : notices.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-10 text-center">
                <div className="text-5xl">📢</div>

                <p className="mt-3 text-gray-500">
                  No notices available
                </p>
              </div>
            ) : (
              <div className="max-h-[600px] space-y-4 overflow-y-auto">

                {notices.map((notice) => (
                  <div
                    key={notice._id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-bold text-gray-800">
                          📢 {notice.title}
                        </h3>

                        <p className="mt-2 whitespace-pre-wrap break-words text-gray-600">
                          {notice.description}
                        </p>

                        <p className="mt-3 text-sm text-gray-400">
                          {notice.createdAt
                            ? new Date(
                                notice.createdAt
                              ).toLocaleDateString()
                            : "Date unavailable"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(notice._id)
                        }
                        className="shrink-0 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Notices;

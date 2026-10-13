
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ParentDashboard() {
  const [user, setUser] = useState(null);
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChild, setShowChild] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    let parsedUser;

    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (parsedUser.role !== "parent") {
      navigate("/");
      return;
    }

    setUser(parsedUser);

    const fetchChild = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/students/parent/my-child",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch child details."
          );
        }

        setChild(data);
        setError("");
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchChild();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const dashboardCards = [
    {
      title: "Attendance",
      description: "Track present days, absences and attendance percentage.",
      path: "/parent/attendance",
      icon: "📅",
      color: "from-sky-500 to-blue-600",
      light: "bg-sky-50",
    },
    {
      title: "Academic Results",
      description: "Review exam marks and your child's academic progress.",
      path: "/parent/results",
      icon: "📊",
      color: "from-violet-500 to-purple-600",
      light: "bg-violet-50",
    },
    {
      title: "School Fees",
      description: "Check fee records, payment status and pending balance.",
      path: "/parent/fees",
      icon: "💳",
      color: "from-emerald-500 to-teal-600",
      light: "bg-emerald-50",
    },
  ];

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="font-medium text-slate-600">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const childDetails = child
    ? [
        ["Student Name", child.name, "👤"],
        ["Admission Number", child.admissionNumber, "🎓"],
        [
          "Class & Section",
          `${child.className || "N/A"}${
            child.section ? ` - ${child.section}` : ""
          }`,
          "🏫",
        ],
        ["Email", child.email, "✉️"],
        ["Phone", child.phone, "📞"],
        [
          "Date of Birth",
          child.dob
            ? new Date(child.dob).toLocaleDateString("en-IN")
            : null,
          "🎂",
        ],
        ["Gender", child.gender, "🧑"],
        ["Parent Name", child.parentName, "👨‍👩‍👧"],
        ["Parent Phone", child.parentPhone, "📱"],
        ["Address", child.address, "📍"],
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-20 border-b border-white/20 bg-white/90 shadow-sm backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl shadow-lg shadow-blue-200">
              🏫
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Edu<span className="text-blue-600">School</span>
              </h1>
              <p className="text-xs text-slate-500">
                Parent Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-500">Welcome back,</p>
              <p className="font-semibold text-slate-800">
                {user.name}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {user.name?.charAt(0)?.toUpperCase() || "P"}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              Logout ↗
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Welcome Hero */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-100 sm:p-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-28 right-36 h-64 w-64 rounded-full bg-indigo-300/20" />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
                ✨ YOUR FAMILY'S SCHOOL SPACE
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
                Hello, {user.name?.split(" ")[0]}!
                <br />
                <span className="text-blue-200">
                  Let's follow your child's journey.
                </span>
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-blue-100">
                Stay connected with school life. Explore attendance,
                academic results and fee details—all in one place.
              </p>

              <button
                onClick={() => setShowChild((previous) => !previous)}
                className="mt-6 rounded-xl bg-white px-5 py-3 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                {showChild ? "Hide Student Profile ↑" : "View Student Profile →"}
              </button>
            </div>

            <div className="hidden shrink-0 md:block">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/20 bg-white/10 text-8xl shadow-inner">
                🎒
              </div>
            </div>
          </div>
        </section>

        {/* Student Profile */}
        {showChild && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                🧑‍🎓
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  My Child's Profile
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Personal and school information
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {loading ? (
                <p className="text-slate-500">Loading student details...</p>
              ) : error ? (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-bold">Unable to load student profile</p>
                  <p className="mt-1">{error}</p>
                </div>
              ) : child ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {childDetails.map(([label, value, icon]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <div className="flex items-center gap-2">
                        <span>{icon}</span>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {label}
                        </p>
                      </div>

                      <p className="mt-2 break-words font-semibold text-slate-800">
                        {value || "Not available"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">
                  No child profile is available for your account.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Quick Overview */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Your dashboard
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              Academic Activities
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Everything you need to stay informed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card) => (
            <button
              key={card.title}
              onClick={() => navigate(card.path)}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/70"
            >
              <div className={`h-1.5 bg-gradient-to-r ${card.color}`} />

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.light} text-3xl transition duration-300 group-hover:scale-110`}
                  >
                    {card.icon}
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-blue-600 group-hover:text-white">
                    ↗
                  </span>
                </div>

                <h4 className="mt-5 text-lg font-bold text-slate-900 transition group-hover:text-blue-700">
                  {card.title}
                </h4>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {card.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-600">
                  View Details
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Helpful note */}
        <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
            💡
          </div>
          <div>
            <h4 className="font-bold text-slate-800">
              Stay involved in your child's progress
            </h4>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Check attendance regularly, review published results, and
              keep track of upcoming fee due dates.
            </p>
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} EduSchool · Parent Portal
        </footer>
      </main>
    </div>
  );
}

export default ParentDashboard;

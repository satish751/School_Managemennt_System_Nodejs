
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ParentDashboard from "./pages/dashboards/ParentDashboard";

import Students from "./pages/admin/Students";
import Teachers from "./pages/admin/Teachers";
import Classes from "./pages/admin/Classes";
import Fees from "./pages/admin/Fees";
import Results from "./pages/admin/Results";
import Notices from "./pages/admin/Notices";

import About from "./pages/About";
import Contact from "./pages/Contact";

import ProtectedRoute from "./components/ProtectedRoute";

import StudentProfile from "./pages/student/StudentProfile";
import StudentClasses from "./pages/student/StudentClasses";
import StudentResults from "./pages/student/StudentResults";
import MyFees from "./pages/student/MyFees";

import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherAttendanceReport from "./pages/teacher/TeacherAttendanceReport";
import TeacherResults from "./pages/teacher/TeacherResults";
import TeacherStudentResults from "./pages/teacher/TeacherStudentResults";

import StudentAttendance from "./pages/student/StudentAttendance";

import MyChild from "./pages/parent/MyChild";
import ParentAttendance from "./pages/parent/ParentAttendance";
import ParentResults from "./pages/parent/ParentResults";
import ParentFees from "./pages/parent/ParentFees";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ================= ADMIN ROUTES ================= */}

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/teachers" element={<Teachers />} />
          <Route path="/admin/classes" element={<Classes />} />
          <Route path="/admin/fees" element={<Fees />} />
          <Route path="/admin/results" element={<Results />} />
          <Route path="/admin/notices" element={<Notices />} />
        </Route>

        {/* ================= TEACHER ROUTES ================= */}

        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

          <Route path="/teacher-classes" element={<TeacherClasses />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route
            path="/teacher-attendance-report"
            element={<TeacherAttendanceReport />}
          />
          <Route path="/teacher-results" element={<TeacherResults />} />
          <Route
            path="/teacher-student-results"
            element={<TeacherStudentResults />}
          />
        </Route>

        {/* ================= STUDENT ROUTES ================= */}

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />

          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/classes" element={<StudentClasses />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student-fees" element={<MyFees />} />
        </Route>

        {/* ================= PARENT ROUTES ================= */}

        <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
          <Route path="/parent-dashboard" element={<ParentDashboard />} />

          <Route path="/parent/my-child" element={<MyChild />} />
          <Route path="/parent/attendance" element={<ParentAttendance />} />
          <Route path="/parent/results" element={<ParentResults />} />
          <Route path="/parent/fees" element={<ParentFees />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

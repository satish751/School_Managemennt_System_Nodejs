
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getMyAttendance,
  getParentChildAttendance,
  markAttendance,
  getClassAttendance,
  getAttendanceReport,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Mark or update attendance — Teacher
router.post(
  "/mark",
  authMiddleware,
  roleMiddleware("teacher"),
  markAttendance
);

// View own attendance — Student
router.get(
  "/my-attendance",
  authMiddleware,
  roleMiddleware("student"),
  getMyAttendance
);

// View linked child's attendance — Parent
router.get(
  "/parent/my-child",
  authMiddleware,
  roleMiddleware("parent"),
  getParentChildAttendance
);

// Get attendance for a class and date — Teacher
router.get(
  "/class",
  authMiddleware,
  roleMiddleware("teacher"),
  getClassAttendance
);

// Get attendance report — Teacher
router.get(
  "/report",
  authMiddleware,
  roleMiddleware("teacher"),
  getAttendanceReport
);

export default router;

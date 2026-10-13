
import express from "express";

import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getMyStudentProfile,
  getMyChild,
} from "../controllers/studentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Existing student management routes
router.post("/", createStudent);

router.get("/", getStudents);

// Student's own profile
router.get(
  "/my-profile",
  authMiddleware,
  getMyStudentProfile
);

// Parent's linked child
router.get(
  "/parent/my-child",
  authMiddleware,
  roleMiddleware("parent"),
  getMyChild
);

// Keep parameter routes after named routes
router.get("/:id", getStudentById);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

export default router;

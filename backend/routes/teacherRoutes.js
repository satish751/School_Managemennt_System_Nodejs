
import express from "express";

import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create Teacher
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createTeacher
);

// Get All Teachers
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getTeachers
);

// Get Teacher By ID
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getTeacherById
);

// Update Teacher
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateTeacher
);

// Delete Teacher
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteTeacher
);

export default router;

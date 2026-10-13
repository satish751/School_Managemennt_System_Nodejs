
import express from "express";

import {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
  getMyResults,
  addTeacherResult,
  getTeacherClassResults,
  getTeacherStudentResults,
  getParentChildResults,
} from "../controllers/resultController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// STUDENT: GET MY RESULTS
router.get(
  "/my-results",
  authMiddleware,
  roleMiddleware("student"),
  getMyResults
);

// TEACHER: ADD OR UPDATE STUDENT MARKS
router.post(
  "/teacher",
  authMiddleware,
  roleMiddleware("teacher"),
  addTeacherResult
);

// TEACHER: GET RESULTS FOR AN ASSIGNED CLASS
router.get(
  "/teacher/class",
  authMiddleware,
  roleMiddleware("teacher"),
  getTeacherClassResults
);

// ADMIN: CREATE RESULT
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createResult
);
// TEACHER: VIEW ALL RESULTS FOR ONE STUDENT
router.get(
  "/teacher/student/:studentId",
  authMiddleware,
  roleMiddleware("teacher"),
  getTeacherStudentResults
);
// ADMIN: GET ALL RESULTS
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getResults
);

// ADMIN: GET RESULT BY ID
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getResultById
);

// ADMIN: UPDATE RESULT
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateResult
);

// ADMIN: DELETE RESULT
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteResult
);
// PARENT: VIEW CHILD'S RESULTS
router.get(
  "/parent/my-child",
  authMiddleware,
  roleMiddleware("parent"),
  getParentChildResults
);
export default router;

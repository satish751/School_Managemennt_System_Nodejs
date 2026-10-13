import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  createClass,
  getClasses,
  getMyClasses,
  getClassById,
  updateClass,
  deleteClass,
  getStudentsByClass,
} from "../controllers/classController.js";

const router = express.Router();

router.get("/my-classes", authMiddleware, getMyClasses);

router.get(
  "/students",
  authMiddleware,
  roleMiddleware("teacher"),
  getStudentsByClass
);

// Keep your existing admin role protection on these routes if you have it.
router.post("/", authMiddleware, roleMiddleware("admin"), createClass);
router.get("/", authMiddleware, roleMiddleware("admin"), getClasses);
router.get("/:id", authMiddleware, getClassById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateClass);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteClass);

export default router;
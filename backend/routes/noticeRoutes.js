
import express from "express";

import {
  createNotice,
  getNotices,
  deleteNotice,
} from "../controllers/noticeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create notice - Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createNotice
);

// Get notices - Public
router.get("/", getNotices);

// Delete notice - Admin only
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteNotice
);

export default router;

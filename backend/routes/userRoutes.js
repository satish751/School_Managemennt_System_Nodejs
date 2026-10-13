
import express from "express";

import {
  createUser,
  loginUser,
  getUsersByRole,
} from "../controllers/userController.js";

const router = express.Router();

// Signup
router.post("/signup", createUser);

// Login
router.post("/login", loginUser);

// Get users by role
router.get("/", getUsersByRole);

export default router;
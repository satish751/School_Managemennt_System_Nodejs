
import express from "express";

import {
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
  getMyFees,
  getParentChildFees,
} from "../controllers/feeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// STUDENT: VIEW OWN FEES
router.get(
  "/my-fees",
  authMiddleware,
  roleMiddleware("student"),
  getMyFees
);

// ADMIN: CREATE FEE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createFee
);

// ADMIN: GET ALL FEES
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getFees
);

// ADMIN: GET FEE BY ID
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getFeeById
);

// ADMIN: UPDATE FEE
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateFee
);

// ADMIN: DELETE FEE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteFee
);
router.get(
  "/parent/my-child",
  authMiddleware,
  roleMiddleware("parent"),
  getParentChildFees
);
export default router;

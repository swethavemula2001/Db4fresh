import express from "express";

import { createAdmin, loginAdmin } from "../controllers/adminauth.js";
import {
  getDashboardStats,
  getUserHistory,
  getRevenueStats,
  getRevenueDetails
} from "../controllers/admin.js";

import {
  requireAuth,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN AUTH (PUBLIC) ================= */
router.post("/create", createAdmin);
router.post("/login", loginAdmin);

/* ================= DASHBOARD ================== */
// ADMIN ONLY
router.get(
  "/stats",
  requireAuth,
  authorizeRoles("ADMIN"),
  getDashboardStats
);

/* ================= USERS ====================== */
// ADMIN ONLY
router.get(
  "/users/:id/history",
  requireAuth,
  authorizeRoles("ADMIN"),
  getUserHistory
);

/* ================= REVENUE ==================== */
// ADMIN ONLY
router.get(
  "/revenue",
  requireAuth,
  authorizeRoles("ADMIN"),
  getRevenueStats
);

router.get(
  "/revenue/details",
  requireAuth,
  authorizeRoles("ADMIN"),
  getRevenueDetails
);

export default router;

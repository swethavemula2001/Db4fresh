import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/signup", signup);        // optional
router.post("/register", signup);      // ✅ REQUIRED
router.post("/login", login);

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
// import express from "express";
// import {
//   register,
//   login,
//   forgotPassword,
//   resetPassword,
// } from "../controllers/authController.js";

// const router = express.Router();

// /* AUTH ROUTES */
// router.post("/register", register);
// router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

// export default router;

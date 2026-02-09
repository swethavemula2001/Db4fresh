// import express from "express";
// import {
//   createOrder,
//   getOrders,
//   getOrderById,
// } from "../controllers/ordersController.js";

// const router = express.Router();

// // ⚠️ ORDER MATTERS
// router.post("/", createOrder);
// router.get("/", getOrders);
// // router.get("/:id", getOrderById); 

// router.get("/:id", (req, res) => {
//   console.log("🔥 ORDER DETAILS ROUTE HIT", req.params.id);
//   res.json({ ok: true });
// });
// // ✅ MUST EXIST

// export default router;

import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
} from "../controllers/ordersController.js";

const router = express.Router();

/* =========================
   ORDERS ROUTES
========================= */

// Create order (before payment)
router.post("/", createOrder);

// Get all orders (admin / user)
router.get("/", getOrders);

// Get single order by ID ✅ (FIXED)
router.get("/:id", getOrderById);

export default router;

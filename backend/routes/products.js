


import express from "express";

import {
  getProducts,
  getProduct,
  createProductWithVariants,
  updateProduct,
  deleteProduct,
  uploadImages,
  getProductDetails,
  getProductReviews,
  getSimilarProducts,
  getSuggestedProducts,
  getProductsBySubcategory,
  searchProducts
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/* ================= IMAGE UPLOAD ================= */
router.post("/upload", upload.array("images", 10), uploadImages);

/* ================= SUBCATEGORY PRODUCTS ================= */
/* ✅ ONLY ONE SUBCATEGORY ROUTE — THIS IS IMPORTANT */
router.get("/subcategory/:subcategoryId", getProductsBySubcategory);

/* ================= MAIN ROUTES ================= */
// Upload multiple images (Add Product)
router.post("/upload", upload.array("images", 10), uploadImages);

// Products
router.get("/", getProducts);
router.post("/", createProductWithVariants);

/* ⚠️ Dynamic routes MUST come last */
// 🔥 FIXED: Update with multiple images
router.put("/:id", upload.array("images", 10), updateProduct);

router.delete("/:id", deleteProduct);

// Extra routes
router.get("/:id/details", getProductDetails);
router.get("/:id/reviews", getProductReviews);
router.get("/:id/similar", getSimilarProducts);
router.get("/:id/suggested", getSuggestedProducts);
router.get("/search", searchProducts);


router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;

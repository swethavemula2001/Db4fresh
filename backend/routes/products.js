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
  getSuggestedProducts
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// Upload multiple images (Add Product)
router.post("/upload", upload.array("images", 10), uploadImages);

// Products
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProductWithVariants);

// 🔥 FIXED: Update with multiple images
router.put("/:id", upload.array("images", 10), updateProduct);

router.delete("/:id", deleteProduct);

// Extra routes
router.get("/:id/details", getProductDetails);
router.get("/:id/reviews", getProductReviews);
router.get("/:id/similar", getSimilarProducts);
router.get("/:id/suggested", getSuggestedProducts);

export default router;

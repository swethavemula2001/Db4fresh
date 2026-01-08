import db from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* ============================================================
   1️⃣ UPLOAD MULTIPLE IMAGES (ADD PRODUCT)
============================================================ */
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedUrls = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (err, result) => {
              if (err) reject(err);
              else
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      })
    );

    res.json({ success: true, images: uploadedUrls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   2️⃣ CREATE PRODUCT + VARIANTS
============================================================ */
export const createProductWithVariants = (req, res, next) => {
  const d = req.body;

  let images = [];
  let variants = [];

  try {
    images =
      typeof d.images === "string" ? JSON.parse(d.images) : d.images || [];
  } catch {
    images = [];
  }

  try {
    variants =
      typeof d.variants === "string"
        ? JSON.parse(d.variants)
        : d.variants || [];
  } catch {
    variants = [];
  }

  const productSql = `
    INSERT INTO products
    (name, category, description, images, manufacture_date, expiry_date, active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    productSql,
    [
      d.name,
      d.category || null,
      d.description || null,
      JSON.stringify(images),
      d.manufacture_date || null,
      d.expiry_date || null,
      d.active ?? 1,
    ],
    (err, result) => {
      if (err) return next(err);

      const productId = result.insertId;

      const validVariants = variants.filter(
        (v) => v.variant_label && v.price
      );

      if (!validVariants.length) {
        return res.json({ message: "Product created", productId });
      }

      const variantSql = `
        INSERT INTO product_variants
        (product_id, variant_label, price, mrp, stock, sku)
        VALUES ?
      `;

      const values = validVariants.map((v) => [
        productId,
        v.variant_label,
        v.price,
        v.mrp ?? null,
        v.stock ?? 0,
        v.sku ?? null,
      ]);

      db.query(variantSql, [values], (verr) => {
        if (verr) return next(verr);
        res.json({ message: "Product + variants added", productId });
      });
    }
  );
};

/* ============================================================
   3️⃣ GET ALL PRODUCTS (ADMIN STOCK LIST + RATINGS ⭐)
============================================================ */
export const getProducts = (req, res, next) => {
  const sql = `
    SELECT 
      p.*,
      ROUND(IFNULL(AVG(r.rating), 0), 1) AS avgRating,
      COUNT(r.id) AS totalReviews
    FROM products p
    LEFT JOIN product_reviews r
      ON p.id = r.product_id
    GROUP BY p.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return next(err);

    const products = rows.map((p) => {
      try {
        p.images = p.images ? JSON.parse(p.images) : [];
      } catch {
        p.images = [];
      }

      p.image =
        p.images.length > 0
          ? p.images[0].url || p.images[0]
          : null;

      return p;
    });

    res.json(products);
  });
};

/* ============================================================
   4️⃣ GET SINGLE PRODUCT (UPDATE PAGE)
============================================================ */
export const getProduct = (req, res, next) => {
  const id = req.params.id;

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return next(err);
      if (!rows.length) {
        return res.status(404).json({ message: "Product not found" });
      }

      const product = rows[0];

      try {
        product.images = product.images ? JSON.parse(product.images) : [];
      } catch {
        product.images = [];
      }

      product.image =
        product.images.length > 0
          ? product.images[0].url || product.images[0]
          : null;

      res.json(product);
    }
  );
};

/* ============================================================
   5️⃣ UPDATE PRODUCT (MULTIPLE IMAGES + DATES)
============================================================ */
export const updateProduct = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT images, image FROM products WHERE id = ?",
    [id],
    async (err, rows) => {
      if (err) return res.status(500).json({ message: "Fetch failed" });
      if (!rows.length)
        return res.status(404).json({ message: "Product not found" });

      let images = [];
      let singleImage = rows[0].image;

      try {
        images = rows[0].images ? JSON.parse(rows[0].images) : [];
      } catch {
        images = [];
      }

      if (req.files && req.files.length > 0) {
        images = await Promise.all(
          req.files.map((file) => {
            return new Promise((resolve, reject) => {
              const uploadStream =
                cloudinary.uploader.upload_stream(
                  { folder: "products" },
                  (err, result) => {
                    if (err) reject(err);
                    else
                      resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                      });
                  }
                );
              streamifier
                .createReadStream(file.buffer)
                .pipe(uploadStream);
            });
          })
        );

        singleImage = images[0]?.url || null;
      }

      const sql = `
        UPDATE products SET
          name = ?,
          price = ?,
          category = ?,
          stock = ?,
          description = ?,
          manufacture_date = IFNULL(NULLIF(?, ''), manufacture_date),
          expiry_date = IFNULL(NULLIF(?, ''), expiry_date),
          image = ?,
          images = ?,
          active = ?
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          req.body.name || null,
          Number(req.body.price) || 0,
          req.body.category || null,
          Number(req.body.stock) || 0,
          req.body.description || null,
          req.body.manufacture_date,
          req.body.expiry_date,
          singleImage,
          JSON.stringify(images),
          1,
          id,
        ],
        (updateErr) => {
          if (updateErr)
            return res.status(500).json({ message: "Update failed" });

          res.json({ message: "Product updated successfully" });
        }
      );
    }
  );
};

/* ============================================================
   6️⃣ DELETE PRODUCT
============================================================ */
export const deleteProduct = (req, res, next) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM product_variants WHERE product_id = ?",
    [id],
    () => {
      db.query(
        "DELETE FROM products WHERE id = ?",
        [id],
        (err) => {
          if (err) return next(err);
          res.json({ message: "Product deleted" });
        }
      );
    }
  );
};

/* ============================================================
   EXTRA APIs
============================================================ */
export const getProductDetails = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({});
      res.json(rows[0] || {});
    }
  );
};

export const getProductReviews = (req, res) => {
  db.query(
    "SELECT rating, comment, created_at FROM product_reviews WHERE product_id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.json([]);
      res.json(rows || []);
    }
  );
};

export const getSimilarProducts = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT * FROM products WHERE id != ? ORDER BY RAND() LIMIT 10",
    [id],
    (err, rows) => {
      if (err) return res.json([]);

      const products = rows.map((p) => {
        try {
          p.images = p.images ? JSON.parse(p.images) : [];
        } catch {
          p.images = [];
        }

        p.image =
          p.images.length > 0
            ? p.images[0].url || p.images[0]
            : null;

        return p;
      });

      res.json(products);
    }
  );
};

export const getSuggestedProducts = getSimilarProducts;

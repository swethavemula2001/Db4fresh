import db from "../config/db.js";

/* ================= IMAGE UPLOAD ================= */
/* ============================================================
   1️⃣ UPLOAD MULTIPLE IMAGES (ADD PRODUCT)
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // store relative paths in DB
    const images = req.files.map(file => ({
      url: `/uploads/products/${file.filename}`,
    }));

    res.json({ images });
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
    console.error("UPLOAD IMAGES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= CREATE PRODUCT ================= */
export const createProductWithVariants = async (req, res) => {
  try {
    const {
      name,
      category_id,
      subcategory_id,
      description,
      manufacture_date,
      expiry_date,
      images = [],
      variants = [],
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO products
      (name, category_id, subcategory_id, description, manufacture_date, expiry_date, images, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        name,
        category_id,
        subcategory_id || null,
        description || null,
        manufacture_date || null,
        expiry_date || null,
        JSON.stringify(images),
      ]
    );

    const productId = result.insertId;

    for (const v of variants) {
      if (!v.variant_label) continue;
/* ============================================================
   2️⃣ CREATE PRODUCT + VARIANTS
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

      await db.query(
        `
        INSERT INTO product_variants
        (product_id, variant_label, price, mrp, stock)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          productId,
          v.variant_label,
          Number(v.price) || 0,
          v.mrp || null,
          Number(v.stock) || 0,
        ]
      );
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

    res.json({ success: true, productId });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL PRODUCTS (ADMIN + HOME) ================= */
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.*,
        MIN(v.price) AS price,
        SUM(v.stock) AS stock
      FROM products p
      LEFT JOIN product_variants v ON v.product_id = p.id
      WHERE p.active = 1
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    const products = rows.map(p => {
      let images = [];
/* ============================================================
   3️⃣ GET ALL PRODUCTS (ADMIN STOCK LIST + RATINGS ⭐)
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
        images = p.images ? JSON.parse(p.images) : [];
      } catch {
        images = [];
      }

      const normalizedImages = images.map(img => ({
        url: img.url.startsWith("http")
          ? img.url
          : `http://localhost:4000${img.url}`,
      }));

      return {
        ...p,
        images: normalizedImages,
        image: normalizedImages[0]?.url || null, // thumbnail
        price: Number(p.price) || 0,
        stock: Number(p.stock) || 0,
      };
    });

    res.json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= GET PRODUCTS BY SUBCATEGORY ================= */
export const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const [rows] = await db.query(`
      SELECT
        p.*,
        COALESCE(MIN(v.price), p.price, 0) AS price,
        COALESCE(SUM(v.stock), p.stock, 0) AS stock
      FROM products p
      LEFT JOIN product_variants v ON v.product_id = p.id
      WHERE p.subcategory_id = ?
        AND p.active = 1
      GROUP BY p.id
    `, [subcategoryId]);

    const products = rows.map(p => {
      let images = [];
      try {
        images = p.images ? JSON.parse(p.images) : [];
      } catch {
        images = [];
      }

      const normalizedImages = images.map(img => ({
        url: img.url?.startsWith("http")
          ? img.url
          : `http://localhost:4000${img.url}`,
      }));

      return {
        ...p,
        images: normalizedImages,
        image: normalizedImages[0]?.url || null,
        price: Number(p.price),
        stock: Number(p.stock),
      };
      p.image =
        p.images.length > 0
          ? p.images[0].url || p.images[0]
          : null;

      return p;
    });

    res.json(products);
  } catch (err) {
    console.error("SUBCATEGORY CONTROLLER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET SINGLE PRODUCT ================= */

export const getProduct = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE id = ?",
    [req.params.id]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Product not found" });
  }

  const product = rows[0];

  let images = [];
  try {
    images = product.images ? JSON.parse(product.images) : [];
  } catch {
    images = [];
  }

  product.images = images.map(img => ({
    url: img.url.startsWith("http")
      ? img.url
      : `http://localhost:4000${img.url}`,
  }));
/* ============================================================
   4️⃣ GET SINGLE PRODUCT (UPDATE PAGE)
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

  const [variants] = await db.query(
    "SELECT * FROM product_variants WHERE product_id = ?",
    [req.params.id]
  );

  product.variants = variants;

  res.json(product);
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      category_id,
      subcategory_id,
      description,
      manufacture_date,
      expiry_date,
      images = [],
      variants = [],
      removedVariantIds = [],
    } = req.body;

    await db.query(
      `
      UPDATE products SET
        name = ?,
        category_id = ?,
        subcategory_id = ?,
        description = ?,
        manufacture_date = ?,
        expiry_date = ?,
        images = ?
      WHERE id = ?
      `,
      [
        name,
        category_id,
        subcategory_id || null,
        description || null,
        manufacture_date || null,
        expiry_date || null,
        JSON.stringify(images),
        id,
      ]
    );

    /* DELETE REMOVED VARIANTS */
    if (removedVariantIds.length > 0) {
      await db.query(
        "DELETE FROM product_variants WHERE id IN (?)",
        [removedVariantIds]
      );
    }

    /* UPSERT VARIANTS */
    for (const v of variants) {
      if (!v.variant_label) continue;

      if (v.id) {
        await db.query(
          `
          UPDATE product_variants
          SET variant_label=?, price=?, mrp=?, stock=?
          WHERE id=?
          `,
          [
            v.variant_label,
            Number(v.price) || 0,
            v.mrp || null,
            Number(v.stock) || 0,
            v.id,
          ]
        );
      } else {
        await db.query(
          `
          INSERT INTO product_variants
          (product_id, variant_label, price, mrp, stock)
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            id,
            v.variant_label,
            Number(v.price) || 0,
            v.mrp || null,
            Number(v.stock) || 0,
          ]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  await db.query(
    "DELETE FROM product_variants WHERE product_id = ?",
    [req.params.id]
  );

  await db.query(
    "DELETE FROM products WHERE id = ?",
    [req.params.id]
  );

  res.json({ message: "Product deleted" });
};

/* ================= EXTRA ================= */
export const getProductDetails = getProduct;

export const getProductReviews = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM product_reviews WHERE product_id = ?",
    [req.params.id]
  );
  res.json(rows);
};

/* ================= SIMILAR PRODUCTS ================= */
export const getSimilarProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.*,
        COALESCE(MIN(v.price), p.price, 0) AS price,
        COALESCE(SUM(v.stock), p.stock, 0) AS stock
      FROM products p
      LEFT JOIN product_variants v ON v.product_id = p.id
      WHERE p.id != ?
        AND p.active = 1
      GROUP BY p.id
      ORDER BY RAND()
      LIMIT 10
    `, [req.params.id]);

    const products = rows.map(p => {
      let images = [];
      try {
        images = p.images ? JSON.parse(p.images) : [];
      } catch {}

      const normalizedImages = images.map(img => ({
        url: img.url?.startsWith("http")
          ? img.url
          : `http://localhost:4000${img.url}`,
      }));

      return {
        ...p,
        images: normalizedImages,
        image: normalizedImages[0]?.url || null,
        price: Number(p.price),
        stock: Number(p.stock),
      };
    });

    res.json(products);
  } catch (err) {
    console.error("SIMILAR PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const [rows] = await db.query(
      `
      SELECT
        id,
        name
      FROM products
      WHERE active = 1
        AND name LIKE ?
      LIMIT 10
      `,
      [`%${q}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSuggestedProducts = getSimilarProducts;
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

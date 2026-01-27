import db from "../config/db.js";

/* ================= IMAGE UPLOAD ================= */
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
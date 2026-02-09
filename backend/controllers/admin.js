
// import db from "../config/db.js";

// /* =========================
//    DASHBOARD STATS ✅
// ========================= */
// export const getDashboardStats = async (req, res) => {
//   try {
//     const [p] = await db.query("SELECT COUNT(*) AS products FROM products");
//     const [o] = await db.query("SELECT COUNT(*) AS orders FROM orders");
//     const [u] = await db.query("SELECT COUNT(*) AS users FROM users");
//     const [r] = await db.query(
//       "SELECT IFNULL(SUM(total_amount), 0) AS revenue FROM orders"
//     );

//     res.json({
//       products: p[0].products,
//       orders: o[0].orders,
//       users: u[0].users,
//       revenue: r[0].revenue,
//     });
//   } catch (err) {
//     console.error("DASHBOARD ERROR:", err);
//     res.status(500).json({
//       products: 0,
//       orders: 0,
//       users: 0,
//       revenue: 0,
//     });
//   }
// };

// /* =========================
//    USER HISTORY
// ========================= */
// export const getUserHistory = (req, res) => {
//   const userId = req.params.id;

//   db.query("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
//     if (err) return res.status(500).json({ message: "Server error" });

//     db.query("SELECT * FROM orders WHERE user_id = ?", [userId], (err, orders) => {
//       if (err) return res.status(500).json({ message: "Server error" });

//       res.json({
//         user: user[0] || {},
//         orders: orders || [],
//       });
//     });
//   });
// };

// /* =========================
//    REVENUE
// ========================= */
// export const getRevenueStats = (req, res) => {
//   db.query(
//     "SELECT COUNT(*) AS totalOrders, IFNULL(SUM(total_amount),0) AS totalRevenue FROM orders",
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "Server error" });

//       res.json({
//         totalOrders: rows[0].totalOrders,
//         totalRevenue: rows[0].totalRevenue,
//       });
//     }
//   );
// };

// export const getRevenueDetails = (req, res) => {
//   db.query(
//     "SELECT DATE(created_at) AS date, SUM(total_amount) AS revenue FROM orders GROUP BY DATE(created_at)",
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "Server error" });
//       res.json(rows);
//     }
//   );
// };


import db from "../config/db.js";

/* =========================
   DASHBOARD STATS ✅ (FIXED)
========================= */
export const getDashboardStats = async (req, res) => {
  try {
    const [p] = await db.query(
      "SELECT COUNT(*) AS products FROM products"
    );

    const [o] = await db.query(
      "SELECT COUNT(*) AS orders FROM orders"
    );

    const [u] = await db.query(
      "SELECT COUNT(*) AS users FROM users"
    );

    // 🔥 FIX: ONLY PAID ORDERS
    const [r] = await db.query(
      "SELECT IFNULL(SUM(total_amount), 0) AS revenue FROM orders WHERE payment_status = 'paid'"
    );

    res.json({
      products: p[0].products,
      orders: o[0].orders,
      users: u[0].users,
      revenue: r[0].revenue,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({
      products: 0,
      orders: 0,
      users: 0,
      revenue: 0,
    });
  }
};

/* =========================
   USER HISTORY (OPTIONAL FILTER)
========================= */
export const getUserHistory = (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) return res.status(500).json({ message: "Server error" });

      db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        [userId],
        (err, orders) => {
          if (err) return res.status(500).json({ message: "Server error" });

          res.json({
            user: user[0] || {},
            orders: orders || [],
          });
        }
      );
    }
  );
};

/* =========================
   REVENUE SUMMARY (FIXED)
========================= */
export const getRevenueStats = (req, res) => {
  db.query(
    `SELECT 
        COUNT(*) AS totalOrders,
        IFNULL(SUM(total_amount), 0) AS totalRevenue
     FROM orders
     WHERE payment_status = 'paid'`,
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Server error" });

      res.json({
        totalOrders: rows[0].totalOrders,
        totalRevenue: rows[0].totalRevenue,
      });
    }
  );
};

/* =========================
   REVENUE BY DATE (FIXED)
========================= */
export const getRevenueDetails = (req, res) => {
  db.query(
    `SELECT 
        DATE(created_at) AS date,
        SUM(total_amount) AS revenue
     FROM orders
     WHERE payment_status = 'paid'
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(rows);
    }
  );
};

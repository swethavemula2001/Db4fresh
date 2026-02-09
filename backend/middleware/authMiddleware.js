import jwt from "jsonwebtoken";

/* =========================
   REQUIRE AUTH (JWT CHECK)
========================= */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_SECRET || "ADMIN_SECRET"
    );

    // req.user = decoded; // ✅ attach user info
    req.user = {
  id: decoded.id || decoded.user_id,
  email: decoded.email,
};
    /* =========================
       Attach user info
       decoded contains:
       { id, role, warehouse_id }
    ========================= */
    req.user = {
      id: decoded.id,
      role: decoded.role,
      warehouse_id: decoded.warehouse_id || null,
    };

    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* =========================
   AUTHORIZE ROLES
========================= */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export default requireAuth;


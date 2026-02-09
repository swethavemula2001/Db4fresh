 
// // // import db from "../config/db.js";
// // // import jwt from "jsonwebtoken";
// // // import bcrypt from "bcryptjs";
 
// // // // =========================
// // // // CREATE ADMIN
// // // // =========================
// // // export const createAdmin = (req, res) => {
// // //   try {
// // //     const { name, email, password } = req.body;
 
// // //     if (!name || !email || !password) {
// // //       return res.status(400).json({ message: "Missing fields" });
// // //     }
 
// // //     // Check if admin exists
// // //     db.query("SELECT * FROM admin WHERE email = ?", [email], (err, rows) => {
// // //       if (err) {
// // //         console.log("DB ERROR:", err);
// // //         return res.status(500).json({ message: "DB Error" });
// // //       }
 
// // //       if (rows.length > 0) {
// // //         return res.status(400).json({ message: "Admin already exists" });
// // //       }
 
// // //       // Hash password
// // //       const hashedPassword = bcrypt.hashSync(password, 10);
 
// // //       // Insert
// // //       const sql =
// // //         "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)";
// // //       db.query(sql, [name, email, hashedPassword], (err, result) => {
// // //         if (err) {
// // //           console.log("INSERT ERROR:", err);
// // //           return res.status(500).json({ message: "DB Error" });
// // //         }
 
// // //         return res.json({ message: "Admin created successfully" });
// // //       });
// // //     });
// // //   } catch (error) {
// // //     console.log("Exception:", error);
// // //     return res.status(500).json({ message: "Server error" });
// // //   }
// // // };
 
// // // // =========================
// // // // LOGIN ADMIN
// // // // =========================
// // // export const loginAdmin = (req, res) => {
// // //   try {
// // //     const email = (req.body?.email || "").trim().toLowerCase();
// // //     const password = (req.body?.password || "").trim();
 
// // //     console.log(`[LOGIN] attempt for ${email}`);
 
// // //     db.query("SELECT * FROM admin WHERE LOWER(email) = ?", [email], (err, rows) => {
// // //       if (err) {
// // //         console.log("DB ERROR:", err);
// // //         return res.status(500).json({ message: "DB Error" });
// // //       }
 
// // //       if (rows.length === 0) {
// // //         console.log("[LOGIN] Admin not found");
// // //         return res.status(400).json({ message: "Admin not found" });
// // //       }
 
// // //       const admin = rows[0];
 
// // //       let validPassword = false;
 
// // //       if (admin.password.startsWith("$2")) {
// // //         // bcrypt hashed
// // //         validPassword = bcrypt.compareSync(password, admin.password);
// // //         console.log("[LOGIN] bcrypt compare =", validPassword);
// // //       } else {
// // //         // plain text
// // //         validPassword = password === admin.password;
// // //         console.log("[LOGIN] plain compare =", validPassword);
// // //       }
 
// // //       if (!validPassword) {
// // //         return res.status(400).json({ message: "Incorrect password" });
// // //       }
 
// // //       // Create token
// // //       // const token = jwt.sign(
// // //       //   { id: admin.id, email: admin.email },
// // //       //   process.env.ADMIN_SECRET || "ADMIN_SECRET",
// // //       //   { expiresIn: "7d" }
// // //       // );
// // //       const token = jwt.sign(
// // //   {
// // //     id: admin.id,
// // //     email: admin.email,
// // //     role: "admin"   // ✅ REQUIRED
// // //   },
// // //   process.env.ADMIN_SECRET || "ADMIN_SECRET",
// // //   { expiresIn: "7d" }
// // // );

 
// // //       // return res.json({
// // //       //   message: "Login successful",
// // //       //   token,
// // //       //   admin: {
// // //       //     id: admin.id,
// // //       //     name: admin.name,
// // //       //     email: admin.email
// // //       //   }
// // //       // });
// // //       return res.json({
// // //   success: true,
// // //   message: "Login successful",
// // //   token,
// // //   admin: {
// // //     id: admin.id,
// // //     name: admin.name,
// // //     email: admin.email
// // //   }
// // // });

// // //     });
// // //   } catch (error) {
// // //     console.log("Exception:", error);
// // //     return res.status(500).json({ message: "Server error" });
// // //   }
// // // };
 
// import jwt from "jsonwebtoken";

// export default function adminAuth(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No admin token" });
//     }

//     const token = authHeader.split(" ")[1];

//     // 🔑 MUST MATCH loginAdmin SECRET
//     const decoded = jwt.verify(
//       token,
//       process.env.ADMIN_SECRET || "ADMIN_SECRET"
//     );

//     // optional role check
//     if (decoded.role !== "admin") {
//       return res.status(403).json({ message: "Not an admin" });
//     }

//     req.admin = decoded;
//     next();
//   } catch (err) {
//     console.error("Admin auth error:", err.message);
//     return res.status(401).json({ message: "Invalid admin token" });
//   }
// }

import jwt from "jsonwebtoken";

/* CREATE ADMIN */
export const createAdmin = async (req, res) => {
  try {
    // example logic (adjust to your DB)
    const admin = {
      id: "admin123",
      role: "admin",
    };

    return res.status(201).json({
      message: "Admin created",
      admin,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* LOGIN ADMIN */
export const loginAdmin = async (req, res) => {
  try {
    // example login logic
    const payload = {
      id: "admin123",
      role: "admin",
    };

    const token = jwt.sign(
      payload,
      process.env.ADMIN_SECRET || "ADMIN_SECRET",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// import mysql from "mysql2";

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "Nikhilch@45",
//   database: process.env.DB_NAME || "db4fresh",
//   port: Number(process.env.DB_PORT) || 3306
// });

// db.connect(err => {
//   if (err) {
//     console.error("Database connection failed:", err);
//   } else {
//     console.log("✅ Connected to MySQL!");
//   }
// });

// export default db;
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "*********",
  database: "db4fresh",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;

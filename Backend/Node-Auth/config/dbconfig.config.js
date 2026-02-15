const mysql = require("mysql2");
require("dotenv").config();

// Create connection pool using connection string
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,   // <-- single connection string
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,

    // Enable SSL in production (Railway requires this)
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false
});

// Test the pool connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Database connected successfully!");
        connection.release();
    }
});

// Handle pool errors
pool.on("error", (err) => {
    console.error("Database pool error:", err);
});

module.exports = pool;

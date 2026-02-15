const mysql = require("mysql2");
require("dotenv").config();

// Create connection pool instead of single connection
// Pool automatically handles reconnections and manages multiple connections
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,          // Maximum number of connections in pool
    queueLimit: 0,                // Unlimited queue
    enableKeepAlive: true,        // Enable TCP keep-alive
    keepAliveInitialDelay: 0      // Start keep-alive immediately
});

// Test the pool connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Database connected successfully!");
        connection.release(); // Release connection back to pool
    }
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

module.exports = pool;

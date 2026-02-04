const mysql = require("mysql2");

// Create connection pool instead of single connection
// Pool automatically handles reconnections and manages multiple connections
const pool = mysql.createPool({
    host: "localhost",
    port: 3309,
    user: "collabit_user",
    password: "collabit_user_pass",
    database: "collabit_user_db",
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

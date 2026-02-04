const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3309,
  user: "collabit_user",
  password: "collabit_user_pass",
  database: "collabit_user_db",
});

console.log("Connecting to database...");

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }

  console.log("Connected to database successfully!");

  // Add reset_token column
  const alterTableQuery = `
    ALTER TABLE user_profiles 
    ADD COLUMN reset_token VARCHAR(255) NULL,
    ADD COLUMN reset_token_expires DATETIME NULL
  `;

  connection.query(alterTableQuery, (err, results) => {
    if (err) {
      // Check if columns already exist
      if (err.code === "ER_DUP_FIELDNAME") {
        console.log("Columns already exist. Skipping...");
      } else {
        console.error("Error adding columns:", err.message);
        connection.end();
        process.exit(1);
      }
    } else {
      console.log("✓ Added reset_token and reset_token_expires columns");
    }

    // Add index for reset_token
    const createIndexQuery = `
      CREATE INDEX idx_reset_token ON user_profiles(reset_token)
    `;

    connection.query(createIndexQuery, (err, results) => {
      if (err) {
        // Check if index already exists
        if (err.code === "ER_DUP_KEYNAME") {
          console.log("Index already exists. Skipping...");
        } else {
          console.error("Error creating index:", err.message);
        }
      } else {
        console.log("✓ Created index on reset_token column");
      }

      // Verify changes
      connection.query("DESCRIBE user_profiles", (err, results) => {
        if (err) {
          console.error("Error describing table:", err.message);
        } else {
          console.log("\n✓ Migration completed successfully!");
          console.log("\nTable structure:");
          console.table(results);
        }

        connection.end();
        console.log("\nDatabase connection closed.");
      });
    });
  });
});

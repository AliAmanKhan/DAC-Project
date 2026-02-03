const db = require("mysql2");

const connection = db.createConnection({
    host: "localhost",
    port: 3309,
    user: "collabit_user",
    password: "collabit_user_pass",
    database: "collabit_user_db"
})

connection.connect((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Database connected!");
    }
})

module.exports = connection;

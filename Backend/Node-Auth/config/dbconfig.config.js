const db = require("mysql2");

const connection = db.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "collabit_user"
})

connection.connect((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Database connected!");
    }
})

module.exports = connection;

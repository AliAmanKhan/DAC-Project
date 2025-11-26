const connection = require("../config/dbconfig.config");
const bcrypt = require("bcrypt");
const SECRET_KEY = "jwt-secret";
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { username, password, dob } = req.body;
    connection.query(
      "select * from user where username = ?",
      [username],
      (err, result) => {
        if (err) {
          console.error(err);
        } else if (result.length > 0) {
          return res.status(400).json({
            message: "User already exist with username!",
          });
        }
      }
    );

    const bcryptPass = await bcrypt.hash(password, 10);
    let user = null;

    connection.query(
      "insert into user values(?, ?, ?)",
      [username, bcryptPass, dob],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Something went wrong!");
        } else {
          user = result;
        }
      }
    );
    const token = jwt.sign({ id: user.id }, SECRET_KEY);

    console.log("User inserted successfully!");
    return res.status(201).json({
      message: "User registered successfully!",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error!");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = null;
    connection.query(
      "select * from user where username = ?",
      [username],
      (err, result) => {
        if (err) {
          return res.status(500).send("Something went wrong!");
        } else {
          user = result[0];
        }
      }
    );

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id }, SECRET_KEY);
      return res.status(200).json({
        message: "User logged in successfully!",
        token,
      })
    } else {
      return res.status(400).send("Wrong password!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error!");
  }
};

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const authRouter = require("./router/authRoute.router");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);

app.use("/", (req, res) => {
    res.send("Welcome to Node-Auth Service");
});

(() => {
    setInterval(() => {
        fetch("https://dac-project.onrender.com");
    }, 30000)
})()

const PORT = process.env.PORT || 3050;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

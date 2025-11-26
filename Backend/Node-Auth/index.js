const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const authRouter = require("./router/authRoute.router");

app.use(bodyParser.json());

app.use("/auth", authRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

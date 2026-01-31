const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/pitch.routes")(app);
// require("./routes/collab.routes")(app);

module.exports = app;

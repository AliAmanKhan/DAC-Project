const express = require("express");
const cors = require("cors");
const requestLogger = require('./middlewares/log.middleware');
const app = express();

app.use(express.json());
app.use(cors());

// request logger
app.use(requestLogger);

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/pitch.routes")(app);
require("./routes/collab.routes")(app);

module.exports = app;

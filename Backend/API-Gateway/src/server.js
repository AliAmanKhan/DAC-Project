require("dotenv").config();
const app = require("./app");

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

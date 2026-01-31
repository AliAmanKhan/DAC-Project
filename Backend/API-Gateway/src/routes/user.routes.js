const { createProxyMiddleware } = require("http-proxy-middleware");
const { USER_SERVICE } = require("../config/services");
const auth = require("../middlewares/auth.middleware");

module.exports = (app) => {
  app.use(
    "/api/users",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite: (path) => `/users${path}`,
    }),
  );
};

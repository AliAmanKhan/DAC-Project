const { createProxyMiddleware } = require("http-proxy-middleware");

const AUTH_SERVICE = "http://localhost:3050";

module.exports = (app) => {
  app.use(
    "/api/auth",
    createProxyMiddleware({
      target: AUTH_SERVICE,
      changeOrigin: true,
      pathRewrite: (path) => `/auth${path}`,
    }),
  );
};

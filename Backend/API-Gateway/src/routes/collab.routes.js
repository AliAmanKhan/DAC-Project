const { createProxyMiddleware } = require("http-proxy-middleware");
const auth = require("../middlewares/auth.middleware");

module.exports = (app) => {
  app.use(
    "/collaborations",
    auth,
    createProxyMiddleware({
      target: "http://localhost:8082",
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        if (req.user && req.user.id) {
          proxyReq.setHeader("X-USER-ID", req.user.id);
        }
      },
    }),
  );
};

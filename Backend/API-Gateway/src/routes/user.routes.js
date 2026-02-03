const { createProxyMiddleware } = require("http-proxy-middleware");
const { USER_SERVICE } = require("../config/services");
const auth = require("../middlewares/auth.middleware");

module.exports = (app) => {
  app.use(
    "/users",
    (req, res, next) => {
      console.log(
        `[API Gateway] /users matched — ${req.method} ${req.originalUrl}`
      );
      next();
    },
    auth,
    createProxyMiddleware({
      target: USER_SERVICE,
      changeOrigin: true,
      logLevel: "debug",

      // 🔑 FIX #1: restore /users prefix for backend
      pathRewrite: (path) => {
        const rewritten = `/users${path}`;
        console.log("[API Gateway] pathRewrite:", path, "→", rewritten);
        return rewritten;
      },

      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[API Gateway] onProxyReq — ${req.method} ${req.originalUrl} → ${proxyReq.path}`
        );

        // Pass authenticated user
        if (req.user?.id) {
          proxyReq.setHeader("X-USER-ID", req.user.id);
          console.log("[API Gateway] X-USER-ID set:", req.user.id);
        }

        // 🔑 FIX #2: re-send body for PUT/POST/PATCH
        if (req.body && Object.keys(req.body).length) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },

      onProxyRes: (proxyRes) => {
        console.log(
          "[API Gateway] proxy response status:",
          proxyRes.statusCode
        );
      },

      onError: (err, req, res) => {
        console.error("[API Gateway] Proxy error:", err.message);
        if (!res.headersSent) {
          res.status(503).json({ error: "User service unavailable" });
        }
      },
    })
  );
};

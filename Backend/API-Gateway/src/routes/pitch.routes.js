const { createProxyMiddleware } = require("http-proxy-middleware");
const { PITCH_SERVICE } = require("../config/services");
const auth = require("../middlewares/auth.middleware");

module.exports = (app) => {
  app.use(
    "/api/pitches",
    // auth,
    createProxyMiddleware({
      target: PITCH_SERVICE,
      changeOrigin: true,
      pathRewrite: (path) => `/pitches${path}`,

    }),
  );
};

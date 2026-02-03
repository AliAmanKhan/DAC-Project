// Logs incoming HTTP requests in a clean, readable format
module.exports = function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  console.log(`\n➡️  ${new Date().toISOString()}  ${method} ${originalUrl}  — from ${req.ip}`);

  if (Object.keys(req.query || {}).length) {
    console.log('    Query:', JSON.stringify(req.query));
  }

  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body && Object.keys(req.body).length) {
    try {
      console.log('    Body:', JSON.stringify(req.body));
    } catch (e) {
      console.log('    Body: <unserializable>');
    }
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`⬅️  ${new Date().toISOString()}  ${method} ${originalUrl}  ${res.statusCode}  — ${duration}ms\n`);
  });

  next();
};

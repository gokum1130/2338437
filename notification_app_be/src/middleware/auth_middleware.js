function authMiddleware(req, res, next) {
  const requiredToken = process.env.ACCESS_TOKEN;

  if (!requiredToken) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const bearer =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
  const headerToken = req.headers["x-access-token"];
  const provided = bearer || headerToken;

  if (provided !== requiredToken) {
    return res.status(401).json({ error: "Invalid or missing access token" });
  }

  next();
}

module.exports = authMiddleware;

import jwt from "jsonwebtoken";

/**
 * Verifies the Authorization: Bearer <token> header issued by
 * POST /api/kvic/auth/login, and attaches { adminId, email } to req.kvicAuth.
 * Separate from src/middleware/auth.js (keeper auth) - a keeper's token will
 * NOT pass this check, since it won't carry role: "kvic_admin".
 */
function requireKvicAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing or invalid Authorization header" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "kvic_admin") {
      return res.status(403).json({ error: "KVIC admin access required" });
    }
    req.kvicAuth = { adminId: decoded.adminId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export { requireKvicAuth };

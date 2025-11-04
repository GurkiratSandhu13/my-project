const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded; 
    next();
  });
}

function permit(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(403).json({ error: "Unauthorized" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied: ${allowedRoles.join(", ")} only` });
    }
    next();
  };
}

module.exports = { verifyToken, permit };


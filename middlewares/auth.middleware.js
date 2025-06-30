const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token", error: err.message });
  }
};

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role" });
    }
    next();
  };
};

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const user = req.user;

    if (
      !user ||
      !user.permissions ||
      !user.permissions.includes(requiredPermission)
    ) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
  checkPermission,
};

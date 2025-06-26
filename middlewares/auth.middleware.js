const jwt = require('jsonwebtoken');

// 1. Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// 2. Check Role Access (like superadmin, admin, etc.)
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role" });
    }
    next();
  };
};

// 3. Check  Permissions (like canAddProduct, canViewProduct, etc.)
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.permissions || !user.permissions.includes(requiredPermission)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    next();
  };
};


module.exports = {
  verifyToken,
  checkRole,
  checkPermission
};

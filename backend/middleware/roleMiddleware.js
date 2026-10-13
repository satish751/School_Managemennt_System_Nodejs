
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRole = String(req.user.role || "").toLowerCase();

    const normalizedRoles = allowedRoles.map((role) =>
      String(role).toLowerCase()
    );

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role is "${userRole || "unknown"}".`,
      });
    }

    next();
  };
};

export default roleMiddleware;
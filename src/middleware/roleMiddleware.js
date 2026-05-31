/**
 * Restrict route access to specific roles.
 * Must be used AFTER `protect` middleware.
 * @param  {...string} roles - Allowed roles (e.g., 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to perform this action.`,
      });
    }
    next();
  };
};

module.exports = { authorize };

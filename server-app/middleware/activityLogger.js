const logger = require("../utils/logger");

const activityLogger = (req, res, next) => {
  logger.info(`User Activity: ${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
};

module.exports = activityLogger;

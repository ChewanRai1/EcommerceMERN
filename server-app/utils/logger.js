const winston = require("winston");
require("winston-daily-rotate-file");

// Define log file rotation
const transport = new winston.transports.DailyRotateFile({
  filename: "logs/activity-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",  // Max log file size
  maxFiles: "30d", // Keep logs for 30 days
});

// Configure Winston Logger
const logger = winston.createLogger({
  level: "info",  // Logging level (info, warn, error)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    transport,   // Save logs to files
    new winston.transports.Console(), // Print logs to console
  ],
});

module.exports = logger;

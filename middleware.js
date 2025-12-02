// Production Middleware Stack
const rateLimit = require('express-rate-limit');
const { validationResult } = require('express-validator');

// Logger utility
const logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg, err) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, err),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  logger.error(`Error on ${req.path}:`, err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});

// Health check
const healthCheck = (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
};

module.exports = { logger, requestLogger, errorHandler, validateRequest, limiter, healthCheck };

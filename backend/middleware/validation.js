const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validatePlaylist = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Playlist name must be 1-100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be boolean'),
  handleValidationErrors,
];

const validateObjectId = (field = 'id') => [
  param(field).isMongoId().withMessage(`Invalid ${field}`),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePlaylist,
  validateObjectId,
  handleValidationErrors,
};

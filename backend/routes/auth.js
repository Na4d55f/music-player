const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;

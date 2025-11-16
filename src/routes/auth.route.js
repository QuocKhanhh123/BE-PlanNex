const router = require('express').Router();
const { register, login, refresh, logout, me, updateProfile, changePassword, sendResetCode, verifyResetCode, resetPassword } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');


router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', auth(true), me);
router.patch('/me', auth(true), updateProfile);
router.post('/change-password', auth(true), changePassword);
router.post('/forgot-password', sendResetCode);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);


module.exports = router;
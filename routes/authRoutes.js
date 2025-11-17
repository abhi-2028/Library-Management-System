const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');

const authController = require('../controllers/authController');

// SIGNUP
router.get('/signup', authController.renderSignupForm);
router.post('/signup', wrapAsync(authController.signupUser));

// LOGIN
router.get('/login', authController.renderLoginForm);
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    authController.loginUser
);

// LOGOUT
router.get('/logout', authController.logoutUser);

module.exports = router;

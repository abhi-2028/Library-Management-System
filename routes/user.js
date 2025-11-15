const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render("users/signup.ejs");
});

router.post('/signup', wrapAsync(async(req,res) => {
    let {username, email, password, role} = req.body;
    const newUser = new User({email, username, role});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    res.redirect('/');
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), async(req,res) =>{
    res.send("welcome");
});

module.exports = router;
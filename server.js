if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ejsMate = require('ejs-mate');
const override = require('method-override');

const User = require('./models/user');

// ROUTES
const authRoutes = require('./routes/authRoutes');     // /users/auth
const adminRoutes = require('./routes/adminRoutes');   // /admin
const userRoutes = require('./routes/userRoutes');     // /users (CRUD from admin)


// ---------------------- DB CONNECTION ----------------------

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/LibraryDB";

mongoose.connect(dbUrl)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.log("❌ DB Error:", err));


// ---------------------- APP SETUP ----------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(override('_method'));


// ---------------------- SESSION & FLASH ----------------------

const sessionConfig = {
    secret: process.env.SECRET || 'devsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
        httpOnly: true
    }
};

app.use(session(sessionConfig));
app.use(flash());


// ---------------------- PASSPORT CONFIG ----------------------

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ---------------------- GLOBAL MIDDLEWARE ----------------------

app.use((req, res, next) => {
    // Provide multiple common local names so views using different names work
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// ---------------------- ROUTES ----------------------

// app.get("/", (req, res) => {
//     res.send("This is the root route of Library Management System");
// });

// AUTH ROUTES (signup, login)
app.use("/auth", authRoutes);

// ADMIN ROUTES (admin dashboard, admin user CRUD)
app.use("/admin", adminRoutes);

// USER CRUD ROUTES (for admin to manage users)
app.use("/users", userRoutes);

// 404 ROUTE
app.use((req, res) => {
    res.status(404).send('errors/404');
});


// ---------------------- SERVER START ----------------------

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});

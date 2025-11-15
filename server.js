if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const ejsmate = require('ejs-mate');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const User = require('./models/user');

const port = process.env.PORT || 3000;

const userRouter = require('./routes/user');

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/LibraryDB';

main()
.then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs',ejsmate);

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 *3, // 3 days
    }
};
app.get('/', (req, res) => {
  res.send('This is root');
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use('/', userRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
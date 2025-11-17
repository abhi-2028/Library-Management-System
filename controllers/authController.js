const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("auth/signup.ejs");  // moved signup under views/auth/
};

module.exports.renderLoginForm = (req, res) => {
    res.render("auth/login.ejs");   // moved login under views/auth/
};

module.exports.signupUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        const newUser = new User({ username, email, role });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to the Library Management System!');
            const role = req.user.role;

            if (role === "admin") {
                return res.redirect("/admin/dashboard");
            }

            if (role === "student") {
                return res.redirect("/users/student/dashboard");
            }

            if (role === "librarian") {
                return res.redirect("/users/librarian/dashboard");
            }
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/auth/signup');
    }
};

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo;
    delete req.session.returnTo;

    if (redirectUrl) {
        return res.redirect(redirectUrl);
    }
    const role = req.user.role;

    if (role === "admin") {
        return res.redirect("/admin/dashboard");
    }

    if (role === "student") {
        return res.redirect("/users/student/dashboard");
    }

    if (role === "librarian") {
        return res.redirect("/users/librarian/dashboard");
    }
    return res.redirect("/");
};



// ---------------- LOGOUT ----------------

module.exports.logoutUser = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully");
        res.redirect("/auth/login");
    });
};

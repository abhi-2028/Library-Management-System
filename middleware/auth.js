module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;  // Store where the user was going
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/auth/login');
    }
    next();
};

// ----- ADMIN -----
module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        req.flash('error', 'Access denied. Admins only.');
        return res.redirect('/');
    }
    next();
};

// ----- LIBRARIAN -----
module.exports.isLibrarian = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'librarian') {
        req.flash('error', 'Access denied. Librarians only.');
        return res.redirect('/');
    }
    next();
};

// ----- STUDENT -----
module.exports.isStudent = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'student') {
        req.flash('error', 'Access denied. Students only.');
        return res.redirect('/');
    }
    next();
};

const User = require("../models/user");

// ADMIN DASHBOARD
module.exports.renderDashboard = async (req, res) => {
    try {
        // Get basic stats
        const totalUsers = await User.countDocuments({role: { $in: ['student','librarian'] }});
        
        // Prepare data for dashboard
        const stats = {
            totalUsers,
            totalBooks: 0,        // Add book model later if needed
            issuedBooks: 0,       // Add transaction model later if needed
            overdueBooks: 0       // Add transaction model later if needed
        };
        
        const recent = [];  // Add recent activity logic later if needed
        
        res.render("dashboard/admin/admin", {
            user: req.user,
            stats,
            recent
        });
    } catch (err) {
        req.flash("error", "Error loading dashboard");
        res.redirect("/");
    }
};

// LIST USERS
module.exports.listUsers = async (req, res) => {
    const users = await User.find({});
    res.render("users/list", { users });
};

// ADD USER FORM
module.exports.renderAddUserForm = (req, res) => {
    res.render("dashboard/admin/users/addUsers");
};

// ADD USER
module.exports.addUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const newUser = new User({ username, email, role });
        await User.register(newUser, password);

        req.flash("success", "User created successfully!");
        res.redirect("/admin/users");

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/admin/users/add");
    }
};

// EDIT USER FORM
module.exports.renderEditUserForm = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        req.flash("error", "User not found!");
        return res.redirect("/admin/users");
    }

    // Render admin-specific edit view
    res.render("dashboard/admin/users/editUsers", { user });
};

// UPDATE USER
module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;

    await User.findByIdAndUpdate(id, { username, email, role });

    req.flash("success", "User updated!");
    res.redirect("/admin/users");
};

// DELETE USER
module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);

    req.flash("success", "User deleted!");
    res.redirect("/admin/users");
};

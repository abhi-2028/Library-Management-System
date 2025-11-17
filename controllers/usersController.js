const User = require("../models/user");

module.exports.listUsers = async (req, res) => {
    const users = await User.find({});
    res.render("users/list", { users });
};

module.exports.viewUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render("users/profile", { user });
};

module.exports.renderEditForm = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render("dashboard/admin/users/editUsers", { user });
};

module.exports.updateUser = async (req, res) => {
    const { username, email } = req.body;
    await User.findByIdAndUpdate(req.params.id, { username, email });
    req.flash('success', 'User updated successfully');
    res.redirect(`/users/${req.params.id}`);
};

module.exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'User deleted successfully');
    res.redirect('/users');
};

module.exports.changeUserRole = async (req, res) => {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });
    req.flash('success', 'Role updated successfully');
    res.redirect('/users');
};

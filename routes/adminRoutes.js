const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// ADMIN DASHBOARD
router.get('/dashboard', isLoggedIn, isAdmin, adminController.renderDashboard);

// USER MANAGEMENT (specific routes BEFORE dynamic :id routes)
router.get('/users/add', isLoggedIn, isAdmin, adminController.renderAddUserForm);
router.post('/users/add', isLoggedIn, isAdmin, adminController.addUser);

router.get('/users', isLoggedIn, isAdmin, adminController.listUsers);
router.get('/users/edit/:id', isLoggedIn, isAdmin, adminController.renderEditUserForm);
// Use PUT for updates so method-override can handle form _method=PUT submissions
router.put('/users/:id', isLoggedIn, isAdmin, adminController.updateUser);

router.post('/users/delete/:id', isLoggedIn, isAdmin, adminController.deleteUser);

// Support method-override DELETE from admin user list forms
router.delete('/users/:id', isLoggedIn, isAdmin, adminController.deleteUser);

module.exports = router;

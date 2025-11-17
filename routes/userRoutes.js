const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const usersController = require('../controllers/usersController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// LIST USERS (Admin Only)
router.get('/list', isAdmin, wrapAsync(usersController.listUsers));

// VIEW USER PROFILE
router.get('/:id', isLoggedIn, wrapAsync(usersController.viewUser));

// EDIT USER FORM
router.get('/:id/edit', isAdmin, wrapAsync(usersController.renderEditForm));

// UPDATE USER
router.put('/:id', isAdmin, wrapAsync(usersController.updateUser));

// DELETE USER
router.delete('/:id', isAdmin, wrapAsync(usersController.deleteUser));

// CHANGE ROLE
router.patch('/:id/role', isAdmin, wrapAsync(usersController.changeUserRole));

module.exports = router;

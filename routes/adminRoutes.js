
const express = require('express');
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');
const router = express.Router();


router.get('/', authController.protect, authController.restrictTo('admin'), adminController.viewAdmin);
router.get('/music', authController.protect, authController.restrictTo('admin'), adminController.viewAdminMusic);

// router.get('/', adminController.viewAdmin);
// router.get('/music', adminController.viewAdminMusic);


module.exports = router;


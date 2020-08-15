
const express = require('express');
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');
const router = express.Router();


router.get('/admin/', authController.protect, authController.restrictTo('admin'), adminController.viewAdmin);



module.exports = router;


const express = require('express');
const musicController = require('./../controllers/musicController');
const authController = require('./../controllers/authController');


const router = express.Router();


router
.route('/')
.get(authController.protect, musicController.getAllMusic)
.post(authController.protect, authController.restrictTo('admin'), musicController.addMusic);

router
.route('/:id')
.get(authController.protect, authController.restrictTo('admin'), musicController.getMusic)
.patch(authController.protect, authController.restrictTo('admin'), musicController.editMusic)
.delete(authController.protect, authController.restrictTo('admin'), musicController.deleteMusic);


module.exports = router;
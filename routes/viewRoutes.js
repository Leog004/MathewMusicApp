const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const router = express.Router();



router.use(authController.isLoggedIn);

router.get('/', viewController.getHomePage);
router.get('/about', viewController.getAboutPage);
router.get('/bio', viewController.getBioPage);
router.get('/music', viewController.getMusicPage);
router.get('/videos', viewController.getVideoPage);
router.get('/contact', viewController.getContactPage);
router.get('/construction', viewController.getConstructionPage);


router.get('/login', viewController.login);


router.post('/contact', viewController.postContact);
router.post('/subscriber', viewController.postSubscriber);


module.exports = router;

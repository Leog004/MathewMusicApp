const express = require('express');
const analyticsController = require('./../controllers/analyticsController');
const router = express.Router();



router.get('/', analyticsController.getAnalytics);
router.post('/', analyticsController.postAnalytics);

module.exports = router;
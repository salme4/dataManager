var express = require('express');
var analysisController = require('../controllers/collectorController');

var router = express.Router();

router.post('/submit', analysisController.submitAnApplication);

router.get('/getStatus', analysisController.getSubmittedApplicationStatus);

router.post('/kill', analysisController.killSubmittedApplication);

module.exports = router;
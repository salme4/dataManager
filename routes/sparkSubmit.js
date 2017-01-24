var express = require('express');
var sparkSubmitController = require('../controllers/sparkSubmitController');

var router = express.Router();

router.get('/submit', sparkSubmitController.submitAnApplication);

router.get('/getStatus', sparkSubmitController.getSubmittedApplicationStatus);

router.post('/kill', sparkSubmitController.killSubmittedApplication);

router.get('/getWorkerIp', sparkSubmitController.getWorkerHostIp);

module.exports = router;
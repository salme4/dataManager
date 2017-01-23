var collectorController = {};

collectorController.submitAnApplication = function(req, res, next){
    console.log("submitAnApplication");
    res.send("submitAnApplication");
};

collectorController.getSubmittedApplicationStatus = function(req, res, next){
    console.log("getSubmittedApplicationStatus");
};

collectorController.killSubmittedApplication = function(req, res, next){
    console.log("killSubmittedApplication");
    res.send("killSubmittedApplication");
};

module.exports = collectorController;
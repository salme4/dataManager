var sparkSubmitController = {};
var request = require('request');
var config = require('../controllers/configController');
var submissionId = "";
var workerIp = "";
var url = 'http://' + config.spark.masterIp1 + ':6066/v1/submissions';


sparkSubmitController.submitAnApplication = function(req, res, next){
    console.log("submitAnApplication");
    var createUrl = url + '/create';
    var header = {
        'Content-Type' : 'application/json'
    };
    var data = new Object();
    var properties = new Object();
    data['action'] = "CreateSubmissionRequest";
    data['appArgs'] = [];
    data['appResource'] = "file:/home/castis/ses/sesql.jar";
    data['mainClass'] = "sesql";
    data['clientSparkVersion'] = "2.0.2";
    data['environmentVariables'] = {"SPARK_ENV_LOADED" : "1"};

    properties['spark.app.name'] = 'SESQL';
    properties['spark.submit.deployMode'] = 'cluster';
    properties['spark.local.dir'] = '/home/castis/spark';
    properties['spark.jars'] = 'file:/home/castis/ses/sesql.jar';
    properties['spark.master'] = 'spark://172.16.33.198:7077,spark://172.16.39.120:7077';
    properties['spark.eventLog.enabled'] = 'true';
    properties['spark.deploy.recoveryMode'] = 'ZOOKEEPER';
    properties['spark.deploy.zookeeper.url'] = '172.16.33.135:2181,172.16.33.113:2181,172.16.33.81:2181';
    properties['spark.deploy.zookeeper.dir'] = '/home/castis/spark';
    properties['spark.eventLog.dir'] = 'hdfs://sescluster/spark/eventLog';
    properties['spark.history.fs.logDirectory'] = 'hdfs://sescluster/spark/eventLog';
    properties['spark.scheduler.mode'] = 'FAIR';
    properties['spark.executor.cores'] = '1';
    properties['spark.executor.memory'] = '3584m';
    properties['spark.executor.instances'] = '1';
    properties['spark.dynamicAllocation.enabled'] = 'true';
    properties['spark.dynamicAllocation.initialExecutors'] = '1';
    properties['spark.dynamicAllocation.minExecutors'] = '10';
    properties['spark.dynamicAllocation.maxExecutors'] = '40';
    properties['spark.shuffle.service.enabled'] = 'true';
    properties['spark.executor.extraClassPath'] = '/home/spark/jars/mysql-connector-java-5.1.39-bin.jar:/home/castis/mongolib/casbah-core_2.11-3.1.1.jar:/home/castis/mongolib/casbah-commons_2.11-3.1.1.jar:/home/castis/1-3.1.1.jar:/home/castis/mongolib/mongodb-driver-3.3.0.jar:/home/castis/mongolib/bson-3.3.0.jar:/home/castis/mongolib/mongo-java-driver-3.3.0.jar:/home/castis/mongolib/mongo-spark-connector_2.11-2.0.0-rc0.jar:/hohadoop-spark-2.0.0-rc0.jar:/home/castis/mongolib/mongo-hadoop-core-2.0.0-rc0.jar';

    data['sparkProperties'] = properties;

    data = JSON.stringify(data);

    var options = {
        url : createUrl,
        headers : header,
        form : data
    };

    request.post(options, function(error, response, body){
        if(!error && response.statusCode === 200){
            var result = JSON.parse(body);
            var responseMessage = result.message;
            console.log(responseMessage);
            if((responseMessage.indexOf('STANDBY') === -1)){
                console.log(result);
                submissionId = result.submissionId;
                res.send(result);
            } else {
                //failOver case
                options.url = 'http://' + config.spark.masterIp2 + ':6066/v1/submissions/create';
                request.post(options, function(error2, response2, body2){
                    if(!error && response.statusCode === 200){
                        var result2 = JSON.parse(body2);
                        console.log(result2);
                        submissionId = result.submissionId;
                        res.send(result2);
                    }
                });
            }
        }
    });
    console.log("function end");

};

sparkSubmitController.getSubmittedApplicationStatus = function(req, res, next){
    console.log("getSubmittedApplicationStatus");
    if(submissionId === ""){
        res.send({reponseMessage : "submissionId is null"});
    } else {
        var statusUrl = url + '/status/' + submissionId;
        request.get(statusUrl, function(error, response, body){
            if(!error && response.statusCode === 200){
                var result = JSON.parse(body);
                workerIp = result.workerHostPort.split(":")[0];
                console.log(result);
                res.send(result);
            }
        });
    }
};

sparkSubmitController.killSubmittedApplication = function(req, res, next){
    console.log("killSubmittedApplication");
    if(submissionId === ""){
        res.send({reponseMessage : "submissionId is null"});
    } else {
        var killUrl = url + '/kill/' + submissionId;
        var header = {
            'Content-Type' : 'application/json'
        };
        var options = {
            url : killUrl,
            headers : header
        };
        request.post(options, function(error, response, body){
            if(!error && response.statusCode === 200){
                var result = JSON.parse(body);
                console.log(result);
                res.send(result);
            }
        });
    }
};

sparkSubmitController.getWorkerHostIp = function(req, res, next){
    console.log("getWorkerHostIp");
    if(workerIp === ""){
        res.send({responseMessage : "no workerIp"});
    } else {
        res.send({workerIp : workerIp});
    }
};

module.exports = sparkSubmitController;
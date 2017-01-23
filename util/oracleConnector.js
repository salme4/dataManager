var oracledb = require('oracledb-pb');
var config = require('../controllers/configController');

var oracleConnector = {};

oracleConnector.getConnect = function(callback){
    oracledb.getConnection(
        {
            user : config.database.user,
            password : config.database.password,
            connectString : config.database.ip + '/' + config.database.sid
        }, callback);
};

oracleConnector.doRelease = function (connection){
    connection.close(function(err){
        if(err)
            console.error(err.message);
    });
};

module.exports = oracleConnector;
var express = require('express');
var router = express.Router();
var config = require('../controllers/configController');
var oracle = require('../util/oracleConnector');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(config);
  oracle.getConnect(function(err, connection){
      connection.execute(
          "select * from emp",
          function(err, result){
              if(err){
                  console.error(err.message);
                  oracle.doRelease(connection);
                  return;
              }
              console.log(result.metaData);
              console.log(result.rows);
              oracle.doRelease(connection);
          });
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;

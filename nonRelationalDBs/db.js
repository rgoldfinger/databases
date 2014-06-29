var mongodb = require("mongodb");
var server = new mongodb.Server('127.0.0.1', 27017, {});

var db = new mongodb.Db('webHistorian', server);
var ar;

db.open(function(err, p_client) {
  if (err) throw err;
  db.createCollection('archive', function(err, collection) {
    if (err) throw err;
    ar = collection;
  });
});

exports.archive = ar;


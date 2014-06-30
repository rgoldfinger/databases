var mongodb = require("mongodb");

// var helper = require('./db-helpers.js');

// var db = require('./db.js');
var request = require('request');

var server = new mongodb.Server('127.0.0.1', 27017, {});
var db = new mongodb.Db('webHistorian', server, {safe: false});


var archive;


var downloadNewUrls = function () {
  archive.find({html: {$exists: false}}).toArray(function(err, docs) {
    if (docs && docs.length) {
      for (var i = 0; i < docs.length; i ++){
        downloadUrl(docs[i].url, archive);
      }
    }
  });



};

var downloadUrl = function(url) {
  request('http://' + url, function(err, html) {

    if (err) throw err;
    //change to update
    // html = html.replace(/\n/, '');
    archive.update({url: url}, {$set: {html: html.body}});
    // archive.findOne({url: url}, function(err, doc) {
    //   console.log("html inserted");
    //   console.log(doc);
    //   if (err) throw err;
    // });
  });
};



db.open(function(err, db) {
  if (err) throw err;
  archive = db.collection('archive');
  setTimeout(function() {
    downloadNewUrls();
    db.close();
  }, 1000);

});





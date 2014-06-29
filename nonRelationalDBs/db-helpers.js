var mongodb = require("mongodb");


// var db = require('./db.js');
var request = require('request');

var server = new mongodb.Server('127.0.0.1', 27017, {});
var db = new mongodb.Db('webHistorian', server, {safe: false});

var archive;

db.open(function(err, db) {
  if (err) throw err;
  archive = db.collection('archive');
});










exports.addUrlToList = function (url, callback) {
  archive.findOne({url: url}, function(err, doc) {
    if (err) throw err;
    if (!doc) {
      archive.insert({url: url}, function (err, doc) {
        if (err) throw err;
        // callback(doc);
      });

    } else {

      // callback(doc);
    }

  });
};

exports.isURLArchived = function (url, callback) {
  archive.findOne({url: url}, function (err, doc) {
    if (err) throw err;
    if (!doc) {
      callback(false);
    } else {
      callback(!!doc.html);
    }

  });

};


exports.downloadNewUrls = function (callback) {
  archive.find({html: {$exists: false}}).toArray(function(err, docs) {
    if (docs.length) {
      for (var i = 0; i < docs.length; i ++){
        exports.downloadUrl(docs[i].url);
      }
    }
  });



};

exports.downloadUrl = function(url, callback) {
  request('http://' + url, function(err, html) {
    if (err) throw err;
    //change to update
    html = 'test';
    archive.update({url: url}, {$set: {html: html}});
    archive.findOne({url: url}, function(err, doc) {
      console.log("html inserted");
      console.log(doc);
      if (err) throw err;
    });
  });
};



exports.getHTMLFromArchive = function (url, callback) {

  archive.findOne({url: url}, function (err, doc) {
    if (err) throw err;
    console.log(doc);
    if (!doc) {
      callback(false);
    } else {
      callback(doc.html);
    }


  });
};


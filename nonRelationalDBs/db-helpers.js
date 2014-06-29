var db = require('./db.js');
var request = require('request');


db.archive;


exports.addUrlToList = function (url, callback) {
  db.archive.upsert({url: url}, function(err, res) {
    callback(err, res);
  });
};

exports.isUrlArchived = function (url, callback) {

};


exports.downloadNewUrls = function (callback) {
  //query db for entries where html is null



};

exports.downloadUrl = function(url, callback) {
  request('http://' + url, function(err, html) {
    if (err) throw err;
    db.archive.insert({url: url, html: html}, function(err, doc) {
      if (err) throw err;
    });
  });
};

exports.isUrlArchived = function (url, callback) {

};

exports.getHTMLFromArchive = function (url, callback) {

};


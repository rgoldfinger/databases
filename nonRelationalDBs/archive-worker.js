var db = require('./db-helpers.js');

setTimeout(function() {
  db.downloadNewUrls();
  
}, 1000);
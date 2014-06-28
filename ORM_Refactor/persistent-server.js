
/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */
/* Import node's http module: */

var http = require("http");
var Sequelize = require("sequelize");
var _ = require('underscore');
var fs = require('fs');
var url = require('url');
var path = require('path');

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css'
};

var ip = '127.0.0.1';
var port = 8080;


var sequelize = new Sequelize("chatter", "root", "");

var User = sequelize.define('User', {
  username: Sequelize.STRING
});

var Message = sequelize.define('Message', {
  // userid: Sequelize.INTEGER,
  // roomid: Sequelize.INTEGER,
  text: Sequelize.STRING,
});

var Room = sequelize.define('Room', {
  roomname: Sequelize.STRING
});


User.hasOne(Message);
Room.hasOne(Message);



var handler = function(req, response) {

  //-------Build Response -----
  //Building a response header
  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if (req.method === 'OPTIONS') {
    headers['Allow'] = 'HEAD,GET,PUT,DELETE,OPTIONS';
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
    return;

  }

  var data={}; //Just so the server does not crash on a different URL
  data.results = [];

  if (req.url === '/1/classes/messages' && req.method === 'GET') {

    statusCode = 200;
    // Get all Messages

    Message.findAll({}).success(function(results){
      data.results = results;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(data));
    });


    // db.getMessages(function(datab){
    //   data.results = datab;

    //   response.writeHead(statusCode, headers);
    //   response.end(JSON.stringify(data));
    // });



  } else if (req.url === '/1/classes/messages' && req.method === 'POST') {
    console.log("In Post");
    statusCode = 201;
    data = '';

    req.on('data',function(chunk){
      data += chunk;
    });

    req.on('end', function(){

      var message = JSON.parse(data.toString());


      User.findOrCreate({username: message.username}).success(function(user) {
        Room.findOrCreate({roomname: message.roomname}).success(function(room) {
          Message.create({text: message.message, UserId: user.id, RoomId: room.id }).success(function() {
            response.writeHead(statusCode, headers);
            response.end(JSON.stringify(data));
          });
        });
      });
    });


  } else if(req.url === '/1/classes/messages'){
    statusCode = 405;
    response.writeHead(statusCode, headers);
    response.end();
  } else {
    var uri = url.parse(req.url).pathname;
    if (uri === '/') {
      uri = '/index.html';
    }

    var fileName = path.join(__dirname, '../client', uri);

    fs.exists(fileName, function(exists) {
      if (exists) {

        var mimeType = mimeTypes[path.extname(fileName)];
        headers['Content-Type'] = mimeType;
        response.writeHead(200, headers);
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(response);
        // response.end();

      } else {
        statusCode = 404;
        response.writeHead(statusCode, headers);
        response.end();

      }
    });
  }


};



var server = http.createServer(handler);

User.sync().success(function() {
  Message.sync().success(function(){
    Room.sync().success(function() {
      server.listen(port,ip);
    });
  });
});




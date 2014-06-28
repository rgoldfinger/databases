
/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */
/* Import node's http module: */
var http = require("http");
var rh = require("./request-handler.js");

var ip = '127.0.0.1';
var port = 8080;

var server = http.createServer(rh.handler);

server.listen(port,ip);

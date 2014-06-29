var path = require('path');
// require more modules/folders here!
var httpHelpers = require('./http-helpers.js');

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      httpHelpers.serveAsset(res, 'index.html');
    } else {
      httpHelpers.serveAsset(res, req.url);
    }
  } else if (req.method === 'POST') {
    httpHelpers.acceptPost(req, res);
  } else {
    httpHelpers.handle404(req, res);
  }
};

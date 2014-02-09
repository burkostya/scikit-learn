var Server = require('./server.js');
var Client = require('zerorpc').Client;

var Scikit = function (options) {
  this._options = options;
};

Scikit.prototype.createServer = function (options) {
  return new Server(options);
};

Scikit.prototype.createClient = function (options) {
  var client = new Client();
  client.connect(options.url);
  return client;
};

module.exports = Scikit;

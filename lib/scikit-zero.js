var Server = require('./server.js');

var Scikit = function (options) {
  this._options = options;
};

Scikit.prototype.createServer = function (options) {
  return new Server(options);
};

module.exports = Scikit;

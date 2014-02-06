var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var zerorpc = require('zerorpc');

var Server = function (options) {
  EventEmitter.call(this);
  this._options = options;
};

util.inherits(Server, EventEmitter);

Server.prototype.listen = function(port, done) {
  var self = this;
  self._options.port = port;
  var args = [
    'server.py',
    '--host', self._options.host || 'localhost',
    '--port', port || '6001'
  ];
  var pyserver = spawn('python2', args, {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  self._pyserver = pyserver;
  pyserver.stderr.setEncoding('utf8');
  pyserver.stderr.on('data', function (data) {
    if (/^execvp\(\)/.test(data)) {
      self.emit('error', new Error(' Failed to start server'));
    }
  });
  pyserver.on('error', function (err) {
    self.emit(err);
  });
  pyserver.on('exit', function (code, signal) {
    var message;
    var err;
    if (code) {
      message = 'Server crashed with code ' + code + ' and signal ' + signal;
      err     = new Error(message);
    }
    if (self._closeCallback) {
      return self._closeCallback(err);
    }
    if (err) {
      return self.emit('error', err);
    }
    self.emit('close');
  });
  done();
};

Server.prototype.close = function (done) {
  this._pyserver.kill();
  this._closeCallback = done;
};

module.exports = Server;

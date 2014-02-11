var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Server = function (options) {
  EventEmitter.call(this);
  this._options = options;
};

util.inherits(Server, EventEmitter);

Server.prototype.listen = function(done) {
  var self = this;

  var args = [
    'server.py',
    '--host', self._options.hostname,
    '--port', self._options.port
  ];
  var pyserver = spawn('python2', args, {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  self._pyserver = pyserver;

  pyserver.stderr.setEncoding('utf8');
  pyserver.stderr.on('data', function (data) {
    if (/^execvp\(\)/.test(data)) {
      return self.emit('error', new Error(' Failed to start server'));
    }
    self._pyerror += data;
  });

  pyserver.on('error', function (err) {
    self.emit(err);
  });
 
  pyserver.on('exit', function (code, signal) {
    var message;
    var err;

    if (code) {
      var pyerr = self._pyerror ? ('Python stderr:\n' + self._pyerror) : '';
      message = 'Server crashed with code ' + code + ' and signal ' + signal + '\n' +
        pyerr;
      err     = new Error(message);
    }

    if (self._closeCallback) {
      var cb = self._closeCallback;
      self._closeCallback = null;
      return cb(err);
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

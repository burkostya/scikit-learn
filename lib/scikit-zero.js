var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var Server = require('./server.js');
//var Client = require('./client.js');
var Client = require('zerorpc').Client;

var readable = require('./readable-stream.js');

var Scikit = function (options) {
  EventEmitter.call(this);

  var defaults = {
    hostname: '127.0.0.1',
    port:     6001,
  };

  options          = options          || {};
  options.hostname = options.hostname || defaults.hostname;
  options.port     = options.port     || defaults.port;
  if (options.remote) {
    this._isRemote = true;
  } else {
    options.remote = 'tcp://' + options.hostname + ':' + options.port;
  }
  this._options = options;
};
util.inherits(Scikit, EventEmitter);

Scikit.prototype.createServer = function (options) {
  return new Server(options);
};

Scikit.prototype.createClient = function (options) {
  return new Client(options);
};

Scikit.prototype.init = function(done) {
  var self = this;
  if (self._isRemote) {
    self._connect(self._options.remote, done);
  } else {
    var server = new Server(self._options);
    server.on('error', function (err) {
      self.emit('error', err);
    });
    self._server = server;
    server.listen(function () {
      self._connect(self._options.remote, done);
    });
  }
};

Scikit.prototype._connect = function(remote, done) {
  var self = this;
  var client = self.createClient();
  client.connect(remote);
  client.on('error', function (err) {
    self.emit('error', err);
  });
  self._client = client;
  client.invoke('_zerorpc_inspect', function (err, res) {
    if (err) {
      return done(err);
    }
    self._initMethods(res.methods);
    done();
  });
};

Scikit.prototype._initMethods = function(methods) {
  this.ping = this._callbackify('ping', methods.ping);
  this.iris = this._readablify('iris', methods.iris);
  this.digits = this._readablify('digits', methods.digits);
};

Scikit.prototype._callbackify = function (name, desc) {
  var self = this;
  var args = desc.args.slice(1);
  if (args.length > 0) {
    return function (options, done) {
      self._client.invoke(name, options, done);
    };
  } else {
    return function (done) {
      self._client.invoke(name, done);
    };
  }
};

Scikit.prototype._readablify = function (name, desc) {
  var self = this;
  return function (subname) {
    var options = { name: name, client: self._client };
    if (subname) { options.subname = subname; }
    return readable(options);
  };
};

Scikit.prototype.exit = function(done) {
  var client = this._client;
  var server = this._server;
  client.close();
  if (this._isRemote) { return setImmediate(done); }
  server.close(function (err) {
    if (err) {
      return done(err);
    }
    done();
  });
};
module.exports = Scikit;

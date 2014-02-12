var util = require('util');

var Readable = require('readable-stream').Readable;

var Stream = function (options) {
  Readable.call(this, { objectMode: true });
  this._name    = options.name;
  this._subname = options.subname;
  this._client  = options.client;
  this._isInvoked = false;
};
util.inherits(Stream, Readable);

Stream.prototype._read = function() {
  var self = this;
  if (self._isInvoked) { return; }
  self._isInvoked = true;
  self._client.invoke(self._name, { subname: self._subname }, function (err, res, more) {
    if (err) { return self.emit('error', err); }
    self.push(res);
    if (!more) { self.push(null); }
  });
};

module.exports = function (options) {
  return new Stream(options);
};

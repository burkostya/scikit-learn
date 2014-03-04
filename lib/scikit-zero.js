var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var bridge = require('./bridge.js');

var Scikit = function (options) {
  EventEmitter.call(this);

  options    = options || {};
  this._options = options;
};
util.inherits(Scikit, EventEmitter);

Scikit.prototype.dataset = function(name) {
  name = name || 'digits';
  var path = name.split('.');
  var method = path[0];
  switch (method) {
    case '20newsgroups':
      method = 'fetch_' + method;
      break;
    default:
      method = 'load_' + method;
  }
  var field  = path[1] || 'data';
  return bridge({
    module: 'datasets',
    method: method,
    field:  field
  });
};

module.exports = Scikit;

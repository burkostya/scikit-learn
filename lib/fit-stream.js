var spawn     = require('child_process').spawn;
var Through   = require('stream').PassThrough;
var Writeable = require('stream').Writeable;
var util      = require('util');

var JSONStream = require('JSONStream');

var Fit = function (options) {
  Writeable.call(this, { objectMode: true });
  this._options = options;
  this._isSpawned = false;
};
util.inherits(Fit, Writeable);

Fit.prototype._write = function (obj, _, done) {
  if (!this._isSpawned) {
    var args = [
      'scikit.py',
      '--module', this._options.module,
      '--method', this._options.method,
      '--field',  this._options.field
    ];
    var pyProcess  = this._pyProcess= spawn('python2', args, {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    var stream = pyProcess.stdout
                  .pipe(JSONStream.parse('*'))
                  .pipe(new Through({ objectMode: true }));

    var error = new Error();
    pyProcess.stderr.setEncoding('utf8');
    pyProcess.stderr.on('data', function (data) {
      if (/^execvp\(\)/.test(data)) {
        error = new Error(' Failed to run python');
      } else {
        error.message += data;
      }
    });

    pyProcess.on('error', function (err) {
      error = err;
    });
   
    pyProcess.on('exit', function (code, signal) {
      var message;

      if (code) {
        var pyerr = error ? ('Python stderr:\n' + error) : '';
        message = 'Python crashed with code ' + code + ' and signal ' + signal + '\n' +
          pyerr;
        error = new Error(message);
        stream.emit('error', error);
      }
    });
    return stream;
  }
  done();
};

module.exports = function (options) {
  return new Fit(options);
};


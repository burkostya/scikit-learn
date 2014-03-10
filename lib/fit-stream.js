var spawn    = require('child_process').spawn;
var Through  = require('stream').PassThrough;
var Writable = require('stream').Writable;
var util     = require('util');

var inspect = require('inspect-stream');
var JSONStream = require('JSONStream');
var stringify = require('streaming-json-stringify');

var Fit = function (options) {
  var self = this;
  Writable.call(this, { objectMode: true });
  self._options = options;
  self._isSpawned = false;
};
util.inherits(Fit, Writable);

Fit.prototype._write = function (obj, _, done) {
  if (!this._isSpawned) {
    var args = [
      'scikit.py',
      '--module', this._options.module,
      '--method', this._options.method
      //'--field',  this._options.field
    ];
    var pyProcess  = this._pyProcess= spawn('python2', args, {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    var stream = pyProcess.stdout
                  .pipe(process.stdout);
                  //.pipe(JSONStream.parse('*'))
                  //.pipe(new Through({ objectMode: true }));


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
    pyProcess.stdin.on('error', function (err) {
      if (error.message) {
        err.message = error.message + '\n' + err.message;
      }
      error = err;
    });
    //pyProcess.stdout.on('readable', function () {});
   
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
    
    var self = this;
    this.on('finish', function () {
      self._pyStdin.end();
    });
    this._pyStdin = stringify();
    this._pyStdin.open      = '';
    this._pyStdin.seperator = '\n';
    this._pyStdin.close     = '';
    this._pyStdin
      //.pipe(inspect());
      .pipe(pyProcess.stdin);
    this._pyStdin.write(this._options.params, 'utf-8', done);
    this._isSpawned = true;
  } else {
    this._pyStdin.write(obj, 'utf-8', done);
  }
};

module.exports = function (options) {
  return new Fit(options);
};


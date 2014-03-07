var spawn    = require('child_process').spawn;
var Through  = require('stream').PassThrough;
var Writable = require('stream').Writable;
var Transform = require('stream').Transform;
var util     = require('util');

var inspect = require('inspect-stream');
var JSONStream = require('JSONStream');

var Fit = function (options) {
  var self = this;
  Writable.call(this, { objectMode: true });
  self._options = options;
  self._isSpawned = false;
  self._source = new Transform({ objectMode: true });
  self._source._transform = function (obj, _, done) {
    this.push(obj);
    done();
  };
  self._source.pipe(self);
  self._source.on('finish', function () {
    console.log('finish');
  });
  self._source.on('end', function () {
    console.log('end');
  });
  self.on('pipe', function (src) {
    src.unpipe(self);
    src.pipe(self._source);
  });
};
util.inherits(Fit, Writable);

Fit.prototype._write = function (obj, _, done) {
  var res;
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

    this._pyStdin = JSONStream.stringify(false);
    this._pyStdin
      .pipe(new Through({ objectMode: true }))
      .pipe(inspect());
      //.pipe(pyProcess.stdin);
    res = this._pyStdin.write(this._options.params);
    if (!res) {
      this._pyStdin.once('drain', done);
    } else {
      done();
    }
    this._isSpawned = true;
  } else {
    res = this._pyStdin.write(obj);
    if (!res) {
      this._pyStdin.once('drain', done);
    } else {
      done();
    }
  }
};

module.exports = function (options) {
  return new Fit(options);
};


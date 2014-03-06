var spawn    = require('child_process').spawn;
var Through  = require('stream').PassThrough;

var JSONStream = require('JSONStream');

module.exports =  function (options) {
  var args = [
    'scikit.py',
    '--module', options.module,
    '--method', options.method,
    '--field',  options.field
  ];
  var pyProcess = spawn('python2', args, {
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
};


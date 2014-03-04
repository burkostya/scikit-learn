var domain = require('domain');

var trace = require('jstrace');
var inspect = require('inspect-stream');

var arrayify = require('arrayify-merge.s');

var Scikit = require('../lib/scikit-zero');

var scikit = new Scikit();

var X = scikit.dataset('digits');
var y = scikit.dataset('digits.target');
var xyify = arrayify({ trace: trace });
X.pipe(xyify);
y.pipe(xyify);
//var k = kk
/*var svc = scikit.svc('fit', {*/
  //gamma: 0.001,
  //C:     100
/*});*/

//var log = inspect();
//xyify.pipe(log);
//var target = scilit.digits('target');
xyify.on('readable', function () {
  //y.read();
  console.log(xyify.read());
})
.on('end', function () {
  console.log('end');
  exit();
})
.on('error', function (err) {
  exit(err);
});

function exit(err) {
  if (err) { console.log(require('util').inspect(err.stack || err, true, 4, true)); }
  console.log('exit');
}

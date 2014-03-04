var inspect = require('inspect-stream');

var arrayify = require('arrayify-merge.s');

var Scikit = require('../lib/scikit-zero');

var scikit = new Scikit();

var X = scikit.dataset('digits');
var y = scikit.dataset('digits.target');
var xyify = arrayify();
X.pipe(xyify);
y.pipe(xyify);
xyify
  .pipe(inspect())
  .on('error', function (err) {
    console.log(err);
  })
  .on('end', function () {
    console.log('end');
  });
//var k = kk
/*var svc = scikit.svc('fit', {*/
  //gamma: 0.001,
  //C:     100
/*});*/



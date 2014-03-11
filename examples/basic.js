var inspect = require('inspect-stream');

var arrayify = require('arrayify-merge.s');
var slice    = require('slice-flow.s');

var Scikit = require('../lib/scikit-zero');

var scikit = new Scikit();

var X = scikit.dataset('digits');
var y = scikit.dataset('digits.target');
var xyify = arrayify();
X.pipe(xyify);
y.pipe(xyify);

var clf = scikit.svm('SVC', {
  gamma: 0.001,
  C:     100
});

xyify
  .pipe(slice([1780, -1]))
  //.pipe(slice([0, -1]))
  .pipe(clf)
  .on('error', function (err) {
    console.log(err);
  })
  .on('model', function (model) {
    console.log(model.toString());
  })
  .on('end', function () {
    console.log('end');
  });

//var predict = clf.predict();
//X.pipe(slice(-1))
  //.pipe(predict)
  //.pipe(inspect());


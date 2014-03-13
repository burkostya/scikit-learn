var inspect = require('inspect-stream');

var arrayify = require('arrayify-merge.s');
var slice    = require('slice-flow.s');

var scikit = require('../lib/scikit-zero');

var features = scikit.dataset('digits');
var labels   = scikit.dataset('digits.target');
var trainingSet = arrayify();
features.pipe(trainingSet);
labels.pipe(trainingSet);

var clf = scikit.svm('SVC', {
  gamma: 0.001,
  C:     100
});

trainingSet
  .pipe(slice([0, -1]))
  .pipe(clf)
  .on('error', function (err) {
    console.log(err);
  })
  .on('end', function () {
    console.log('training complete');

    var predict = clf.predict();
    var features = scikit.dataset('digits');
    features.pipe(slice(-1))
      .pipe(predict)
      .pipe(inspect());
  });



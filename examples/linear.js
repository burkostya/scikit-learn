var inspect  = require('inspect-stream');
var arrayify = require('arrayify-merge.s');
var slice    = require('slice-flow.s');

var scikit = require('../lib/scikit-learn');

var features = scikit.dataset('load_diabetes.data');
var labels   = scikit.dataset('load_diabetes.target');

var trainingSet = arrayify();

features.pipe(trainingSet);
labels.pipe(trainingSet);

trainingSet
  .pipe(slice([0, -20]))
  .pipe(inspect());

var regr = scikit.linearModel('LinearRegression');

var dataset = require('./dataset-stream');
var fit     = require('./fit-stream');

function bridge(options) {
  switch (options.module) {
    case 'datasets':
      return dataset(options);
    case 'svm':
      return fit(options);
    default:
  }
}

module.exports = bridge;

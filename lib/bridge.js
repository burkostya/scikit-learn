var dataset = require('./dataset-stream');

function bridge(options) {
  if (options.module === 'datasets') {
    return dataset(options);
  }
}

module.exports = bridge;

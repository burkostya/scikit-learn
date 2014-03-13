var dataset = require('./dataset-stream.js');
var fit     = require('./fit-stream.js');

module.exports = {
  dataset: function (name) {
    name = name || 'digits';
    var path = name.split('.');
    var method = path[0];
    switch (method) {
      case '20newsgroups':
        method = 'fetch_' + method;
        break;
      default:
        method = 'load_' + method;
    }
    var field  = path[1] || 'data';
    return dataset({
      module: 'datasets',
      method: method,
      field:  field
    });
  },
  svm: function (algorithm, options) {
    return fit({
      module: 'svm',
      method: algorithm,
      params: options
    });
  }
};


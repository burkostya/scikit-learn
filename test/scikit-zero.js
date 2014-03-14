var expect = require('chai').expect;

var arrayify = require('arrayify-merge.s');
var slice    = require('slice-flow.s');

var scikit = require('../lib/scikit-learn');

describe('scikit-zero', function (){
  describe('datasets', function(){
    it('should return data', function(done){
      var labels = scikit.dataset('load_digits.target', { n_class: 7 });
      labels.on('readable', function () {
        var label;
        while ((label = this.read()) !== null) {
          expect(label).to.be.below(7);
        }
      });
      labels.on('end', function () {
        done();
      });
    });
  });
  describe('fit stream', function(){
    it('should produce trained model', function(done){
      var labels   = scikit.dataset('load_digits.target', { n_class: 7 });
      var features = scikit.dataset('load_digits.data', { n_class: 7 });
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
        .on('error', done)
        .on('end', function () {
          expect(this._model).to.have.length.at.least(1000);
          done();
        });
    });
  });
  describe('predict stream', function(){
    it('should predict', function(done){
      var labels   = scikit.dataset('load_digits.target', { n_class: 8 });
      var features = scikit.dataset('load_digits.data', { n_class: 8 });
      var trainingSet = arrayify();
      features.pipe(trainingSet);
      labels.pipe(trainingSet);
      var clf = scikit.svm('SVC', {
        gamma: 0.001,
        C:     100
      });
      trainingSet
        .pipe(slice([0, -3]))
        .pipe(clf)
        .on('error', done)
        .on('end', function () {
          var predicted = [];
          var predict = clf.predict();
          var features = scikit.dataset('load_digits.data', { n_class: 8 });
          features.pipe(slice(-3))
            .pipe(predict)
            .on('error', done)
            .on('readable', function () {
              var label;
              while ((label = this.read()) !== null) {
                predicted.push(label);
              }
            })
            .on('end', function () {
              expect(predicted).to.have.length(3);
              expect(predicted[0]).to.equal(4);
              expect(predicted[1]).to.equal(4);
              expect(predicted[2]).to.equal(0);
              done();
            });
        });
    });
  });
});

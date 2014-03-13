var expect = require('chai').expect;

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
});

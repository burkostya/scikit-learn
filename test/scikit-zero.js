var expect = require('chai').expect;

var zerorpc = require('zerorpc');
var Scikit = require('../lib/scikit-zero');

describe('scikit-zero', function (){
  describe('communication', function () {
    it('should work standalone', function(done){
      var scikit = new Scikit();
      scikit.init(function (err) {
        expect(err).to.not.exists;
        scikit.ping(function (err, res) {
          expect(err).to.not.exists;
          expect(res).to.equal('pong');
          scikit.exit(function (err) {
            expect(err).to.not.exists;
            done();
          });
        });
      });
    });
    it('should work standalone with custom server settings', function(done){
      this.timeout(20000);
      var scikit = new Scikit({
        hostname: '0.0.0.0',
        port: 6002
      });
      scikit.on('error', function (err) {
        done(err);
      });
      scikit.init(function (err) {
        expect(err).to.not.exists;
        scikit.ping(function (err, res) {
          expect(err).to.not.exists;
          expect(res).to.equal('pong');
          scikit.exit(function (err) {
            expect(err).to.not.exists;
            done();
          });
        });
      });
    });
    it('should work with custom remote server', function (done){
      var scikitRemote = new Scikit();
      var server = scikitRemote.createServer({
        hostname: '0.0.0.0',
        port:     6001
      });
      server.on('error', function (err) {
        server.close();
        done(err);
      });
      server.listen(function () {
        var scikit = new Scikit({
          remote: 'tcp://0.0.0.0:6001'
        });
        scikit.init(function (err) {
          expect(err).to.not.exists;
          scikit.ping(function (err, res) {
            expect(err).to.not.exists;
            expect(res).to.equal('pong');
            scikit.exit(function (err) {
              expect(err).to.not.exists;
              server.close(function (err) {
                expect(err).to.not.exists;
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('learn part', function () {
    var scikit;
    beforeEach(function (done) {
      scikit = new Scikit();
      scikit.init(done);
    });
    afterEach(function (done) {
      scikit.exit(done);
    });
    /*it('should do something', function(done){*/
      
      //done();
    /*});*/
  });
});

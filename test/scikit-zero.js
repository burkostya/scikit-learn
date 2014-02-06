var expect = require('chai').expect;

var zerorpc = require('zerorpc');
var Scikit = require('../lib/scikit-zero');

describe('scikit-zero', function (){
  it('should create server and close it', function (done){
    var scikit = new Scikit();
    var server = scikit.createServer({
      host: '0.0.0.0'
    });
    server.on('error', function (err) {
      server.close();
      done(err);
    });
    server.listen(6001, function () {
      var client = new zerorpc.Client();
      client.connect('tcp://0.0.0.0:6001');
      client.invoke('ping', function (err, res) {
        client.close();
        expect(err).to.not.exists;
        expect(res).to.equal('pong');
        server.close(function (err) {
          expect(err).to.not.exists;
          done();
        });
      });
    });
  });
});

var domain = require('domain');

var Scikit = require('../lib/scikit-zero');

var scikit = new Scikit();

scikit.init(function (err) {
  if (err) { return exit(err); }
  var d = domain.create();
  d.on('error', exit);
  d.run(function () {
    var digits = scikit.digits();
    digits.on('readable', function () {
      console.log(digits.read());
    })
    .on('end', function () {
      console.log('end');
      exit();
    })
    .on('error', function (err) {
      exit(err);
    });
  });
});

function exit(err) {
  if (err) { console.error(err); }
  scikit.exit(function (err) {
    if (err) { console.error(err); }
    console.log('exit');
  });
}

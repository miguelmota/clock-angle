var test = require('tape');
var clockAngle = require('../clock-angle');

test('clock angle', function (t) {
  t.plan(7);

  t.equal(clockAngle(3), 90);
  t.equal(clockAngle(6), 180);

  t.equal(clockAngle(null, 15), 90);
  t.equal(clockAngle(null, 30), 180);

  t.equal(clockAngle(0,15), 90);
  t.equal(clockAngle(12,15), 90);
  t.equal(clockAngle(9,15), 180);
});

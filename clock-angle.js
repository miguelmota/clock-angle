(function(){

  function angleBtwnMinuteAnd12oclock(m) {
    return 360 * m / 60;
  }

  function angleBtwnHourAnd12oclock(h, m) {
    m = m || 0;
    return 360 * (h % 12) / 12 + 360 * (m / 60) * (1 / 12);
  }

  function angleBtwnHourAndMinute(h, m) {
    var r = (angleBtwnHourAnd12oclock(h) - angleBtwnMinuteAnd12oclock(m)) % 360;
    return Math.abs(r);
  }

  var clockAngle = function(h, m) {
    if (typeof m === 'undefined') {
      return angleBtwnHourAnd12oclock(h);
    }
    if (typeof h === 'undefined') {
      return angleBtwnMinuteAnd12oclock(m);
    }
    return angleBtwnHourAndMinute(h,m);
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = clockAngle;
  } else {
    window.clockAngle = clockAngle;
  }

})();

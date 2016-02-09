(function(){

  function angleBtwnMinuteAnd12oclock(m) {
    m = m || 0;
    m = m % 60;

    return m * 6;
  }

  function angleBtwnHourAnd12oclock(h, m) {
    m = m || 0;
    h = h || 0;

    m = m % 60;
    h = h % 12;

    return (h + (m / 60)) * 30;
  }

  function angleBtwnHourAndMinute(h, m) {
    if(h == null) return angleBtwnMinuteAnd12oclock(m) % 360;

    return smallestAngle(angleBtwnHourAnd12oclock(h, m) - angleBtwnMinuteAnd12oclock(m));
  }

  function smallestAngle(d) {
    d = Math.abs(d) % 360;

    return (d < 180) ? d : 360 - d;
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

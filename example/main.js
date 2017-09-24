(function() {
  window.renderClock()

  var output = document.querySelector('.AngleOutput')

  function refresh() {
    var h = Math.floor(window.clock.hh)
    var m = window.clock.mm
    var angle = clockAngle(h, m)

    output.innerHTML = angle.toFixed(2) + '°'

    setTimeout(refresh, 1e3)
  }

  refresh()
})();

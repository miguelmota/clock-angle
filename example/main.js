window.renderClock()

var output = document.querySelector('.Result')


function refresh() {
  var angle = clockAngle(window.clock.hh, window.clock.mm)

  output.innerHTML = angle.toFixed(2) + '°'

  setTimeout(refresh, 1e3)
}

refresh()


# clock-angle

> Find smallest angle between hour and minute hands on the face of a standard 12-hr clock, in degrees.

# Demo

[https://lab.miguelmota.com/clock-angle](https://lab.miguelmota.com/clock-angle)

# Install

```bash
npm install clock-angle
```

# Usage

```javascript
var clockAngle = require('clock-angle');

// 12 o'clock to hour hand
clockAngle(3) // 90
clockAngle(6) // 180

// 12 o'clock to minute hand
clockAngle(null, 15) // 90
clockAngle(null, 30) // 180

// hour hand to minute hand
clockAngle(3, 0) // 90
clockAngle(0, 15) // 82.5
clockAngle(12, 15) // 82.5
clockAngle(9, 15) // 172.5
clockAngle(11, 59) // 5.5
```

# Test

```bash
npm test
```

# License

MIT

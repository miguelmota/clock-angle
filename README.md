# clock-angle

Find angle between hour and minute hands

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
clockAngle(0,15) // 90
clockAngle(12,15) // 90
clockAngle(9,15) // 180
```

# License

MIT

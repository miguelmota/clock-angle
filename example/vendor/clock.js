/*
 Credit: https://www.mathsisfun.com/time-clocks-analog-digital.html
 */

/*
clock.hh = hr;
clock.mm = (clock.hh - (clock.hh >> 0)) * 60;
clock.redraw();
dig.setHH(clock.hh);
dig.setMM(clock.mm);
*/


function renderClock() {
    var w = 250;
    var h = w;
    radius = w * 0.4;
    var shadow = w * 0.00;
    var digWd = w * 0.8;
    var digHt = 80;
    var s = '';
    s += '<div id="main" style="position:relative; width:' + w + 'px; min-height:' + (h + 120) + 'px; margin:auto; display:block;border-radius: 10px; ">';
    s += '<canvas id="clock1" style="position: absolute; width:' + w + 'px; height:' + h + 'px; left: ' + (shadow) + 'px; top: ' + (-shadow) + 'px; z-index: 2; border: none;"></canvas>';
    s += '<canvas id="clock2" style="position: absolute; width:' + w + 'px; height:' + h + 'px; left: ' + (shadow) + 'px; top: ' + (-shadow) + 'px; z-index: 3; border: none;"></canvas>';
    s += '<div style="position: absolute; width:' + (digWd + 1 * 2) + 'px; height:' + (digHt + 1 * 2) + 'px; left: 14px; top: 262px; z-index: 3; border: none; padding:0px; border-radius: 10px; background-color: #222;overflow: hidden;">';
    s += '<canvas id="canavasdig" ></canvas>';
    s += '</div>';
    s += '<button id="px" onclick="setNow()" style="position: absolute; width:60px; height:20px; left: 20px; top: 239px; font: 12px Arial; z-index:200;" class="togglebtn" >Now</button>';
    s += '</div>';
    var container = document.querySelector('.ClockContainer');
    container.innerHTML = s
    el = document.getElementById('clock1');
    ratio = 3;
    el.width = w * ratio;
    el.height = h * ratio;
    el.style.width = w + "px";
    el.style.height = h + "px";
    g = el.getContext("2d");
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    el2 = document.getElementById('clock2');
    ratio = 3;
    el2.width = w * ratio;
    el2.height = h * ratio;
    el2.style.width = w + "px";
    el2.style.height = h + "px";
    g2 = el2.getContext("2d");
    g2.setTransform(ratio, 0, 0, ratio, 0, 0);
    el3 = document.getElementById('canavasdig');
    ratio = 3;
    el3.width = digWd * ratio;
    el3.height = digHt * ratio;
    el3.style.width = digWd + "px";
    el3.style.height = digHt + "px";
    g3 = el3.getContext("2d");
    g3.setTransform(ratio, 0, 0, ratio, 0, 0);
    dragType = '';
    modes = ['now', 'fix', 'hr', 'mn'];
    modeNo = 0;
    mode = modes[modeNo];
    clock = new Clock(el, clockRadius());
    clock.drawFace();
    clock.drawMinuteMarkers();
    dig = new Digital(g3, digWd, digHt);
    dig.update();
    render();
    el2.addEventListener("mousedown", onmouseDown, false);
    el2.addEventListener('touchstart', ontouchstart, false);
    el2.addEventListener("mousemove", onmousemovePointer, false);
}

function setNow() {
    dragType = '';
    dig.mode = 'now';
}

function digMode() {
    modeNo = (++modeNo) % modes.length;
    mode = modes[modeNo];
    console.log("digMode", modeNo, mode);
    dragType = '';
    dig.setMode(mode);
}

function digSet() {
    console.log("digSet");
}

function ontouchstart(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    onmouseDown(evt)
}

function ontouchmove(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    onmouseMove(evt);
    evt.preventDefault();
}

function ontouchend() {
    el2.addEventListener('touchstart', ontouchstart, false);
    window.removeEventListener("touchend", ontouchend, false);
    window.removeEventListener("touchmove", ontouchmove, false);
}

function onmousemovePointer(e) {
    var bRect = el.getBoundingClientRect();
    var mouseX = (e.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (e.clientY - bRect.top) * (el.height / ratio / bRect.height);
    var angle = Math.atan2(mouseY - clock.center.y, clock.center.x - mouseX);
    angle -= 3 * Math.PI / 2;
    if (angle < -2 * Math.PI) angle += 2 * Math.PI;
    var draggableQ = false;
    if (isNear(angle, clock.getHourAngle(), 0.1) || isNear(angle, clock.getMinuteAngle(), 0.1)) {
        if (dist(mouseY - clock.center.y, clock.center.x - mouseX) < radius) {
            draggableQ = true;
        }
    }
    if (draggableQ) {
        document.body.style.cursor = "pointer";
    } else {
        document.body.style.cursor = "default";
    }
}

function onmouseDown(evt) {
    console.log("onmouseDown");
    var bRect = el.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
    var angle = Math.atan2(mouseY - clock.center.y, clock.center.x - mouseX);
    angle -= 3 * Math.PI / 2;
    if (angle < -2 * Math.PI) angle += 2 * Math.PI;
    dragType = '';
    if (isNear(angle, clock.getHourAngle(), 0.1)) {
        dragType = 'hour';
    } else {
        if (isNear(angle, clock.getMinuteAngle(), 0.1)) {
            dragType = 'min';
        }
    }
    if (dragType != '') {
        if (evt.touchQ) {
            window.addEventListener('touchmove', ontouchmove, false);
        } else {
            window.addEventListener("mousemove", onmouseMove, false);
        }
    }
    if (evt.touchQ) {
        el2.removeEventListener("touchstart", ontouchstart, false);
        window.addEventListener("touchend", ontouchend, false);
    } else {
        el2.removeEventListener("mousedown", onmouseDown, false);
        window.addEventListener("mouseup", onmouseUp, false);
    }
    if (evt.preventDefault) {
        evt.preventDefault();
    } else if (evt.returnValue) {
        evt.returnValue = false;
    }
    return false;
}

function onmouseUp() {
    el2.addEventListener("mousedown", onmouseDown, false);
    window.removeEventListener("mouseup", onmouseUp, false);
    if (dragType != '') {
        window.removeEventListener("mousemove", onmouseMove, false);
    }
}

function onmouseMove(evt) {
    var bRect = el.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
    switch (dragType) {
        case 'hour':
            var angle1 = Math.atan2(clock.center.y - mouseY, mouseX - clock.center.x);
            var hr = 3 - 6 * angle1 / Math.PI;
            if (hr < 0) hr += 12;
            clock.hh = hr;
            clock.mm = (clock.hh - (clock.hh >> 0)) * 60;
            clock.redraw();
            dig.setHH(clock.hh);
            dig.setMM(clock.mm);
            break;
        case 'min':
            angle1 = Math.atan2(clock.center.y - mouseY, mouseX - clock.center.x);
            var mn = 15 - 30 * angle1 / Math.PI;
            if (mn < 0) mn += 60;
            clock.mm = mn;
            var oldHrMin = (clock.hh - (clock.hh >> 0)) * 60;
            var diff = mn - oldHrMin;
            if (diff < -30) diff += 60;
            if (diff > 30) diff -= 60;
            clock.hh += diff / 60;
            clock.redraw();
            dig.setMM(mn);
            dig.setHH(clock.hh);
            dig.setMM(clock.mm);
            break;
        default:
    }
}

function clockRadius() {
    return radius * 1.03;
}

function render() {
    if (dragType == '') clock.update();
    requestAnimationFrame(render);
}
var Digital = function(canvas, w, h) {
    this.g = canvas;
    this.ssQ = false;
    this.amQ = false;
    this.hh = 0;
    this.mm = 0;
    this.ss = 0;
    if (this.ssQ) {
        this.numHt = w * 0.17;
        this.numWd = this.numHt * 0.45;
        this.numGap = this.numHt * 0.2;
        this.midX = w / 2;
        this.midY = h / 2;
    } else {
        this.numHt = w * 0.27;
        this.numWd = this.numHt * 0.45;
        this.numGap = this.numHt * 0.2;
        this.midX = w / 2;
        this.midY = h / 2;
    }
    this.typ = 'led';
    switch (this.typ) {
        case 'lcd':
            this.bgClr = 'rgb(240,240,240)';
            this.edgeClr = this.bgClr;
            this.onClr = 'rgb(40,40,40)';
            this.offClr = 'rgb(230,230,230)';
            this.offClr = this.bgClr;
            break;
        case 'led':
            this.bgClr = 'rgb(50, 50, 0)';
            this.edgeClr = 'rgb(100, 255, 0)';
            this.onClr = 'rgb(100, 255, 0)';
            this.offClr = 'rgb(80, 80, 0)';
            break;
        default:
    }
    this.numbers = {
        n0: [1, 1, 1, 0, 1, 1, 1],
        n1: [0, 0, 1, 0, 0, 1, 0],
        n2: [1, 0, 1, 1, 1, 0, 1],
        n3: [1, 0, 1, 1, 0, 1, 1],
        n4: [0, 1, 1, 1, 0, 1, 0],
        n5: [1, 1, 0, 1, 0, 1, 1],
        n6: [0, 1, 0, 1, 1, 1, 1],
        n7: [1, 0, 1, 0, 0, 1, 0],
        n8: [1, 1, 1, 1, 1, 1, 1],
        n9: [1, 1, 1, 1, 0, 1, 1]
    };
    this.mode = 'now';
};
Digital.prototype.update = function() {
    switch (this.mode) {
        case 'now':
            this.setTimeNow();
            this.redraw();
            break;
        default:
    }
    requestAnimationFrame(this.update.bind(this));
};
Digital.prototype.redraw = function() {
    var g = this.g;
    g.fillStyle = this.bgClr;
    g.fillRect(0, 0, innerWidth, innerHeight);
    if (this.ssQ) {
        var timeStr = this.hh + this.mm + this.ss;
    } else {
        timeStr = this.hh + this.mm;
    }
    for (var i = 0; i < timeStr.length; i++) {
        this.drawNum(i, this.midX, this.midY, this.numbers['n' + timeStr[i]]);
    }
    this.setClr(this.ss % 2);
    this.colon(this.ss);
};
Digital.prototype.setHH = function(hr) {
    this.hh = String(hr << 0);
    if (this.hh == 0) {
        this.hh = '12'
    } else if (this.hh.length == 1) {
        this.hh = '0' + this.hh
    }
    this.mode = 'fix';
    this.redraw();
};
Digital.prototype.setMM = function(mn) {
    this.mm = String(mn << 0);
    if (this.mm.length == 1) {
        this.mm = '0' + this.mm
    }
    this.mode = 'fix';
    this.redraw();
};
Digital.prototype.setTimeNow = function() {
    var time = new Date();
    this.hh = time.getHours();
    if (this.hh > 12) this.hh -= 12;
    this.hh = this.hh.toString();
    if (this.hh == 0) {
        this.hh = '12'
    } else if (this.hh.length == 1) {
        this.hh = '0' + this.hh
    }
    this.mm = time.getMinutes().toString();
    if (this.mm.length == 1) {
        this.mm = '0' + this.mm
    }
    this.ss = time.getSeconds().toString();
    if (this.ss.length == 1) {
        this.ss = '0' + this.ss
    }
};
Digital.prototype.setMode = function(mode) {
    this.mode = mode;
    console.log("Digital setMode", this.mode);
};
Digital.prototype.drawNum = function(pos, x, y, numArray) {
    var xShift;
    if (this.ssQ) {
        switch (pos) {
            case 0:
                xShift = ((this.numWd * 3) + (this.numGap * 2)) * -1 - 20;
                break;
            case 1:
                xShift = ((this.numWd * 2) + (this.numGap * 1)) * -1 - 20;
                break;
            case 2:
                xShift = (this.numWd) * -1;
                break;
            case 3:
                xShift = this.numGap;
                break;
            case 4:
                xShift = (this.numWd) + (this.numGap * 2) + 20;
                break;
            case 5:
                xShift = (this.numWd * 2) + (this.numGap * 3) + 20;
                break;
        }
        xShift -= 5;
    } else {
        xShift = (pos - 3) * this.numWd + this.numGap * pos;
        xShift += Math.floor(pos / 2) * this.numGap * 2;
    }
    for (var i = 0; i < numArray.length; i++) {
        this.segment(this.midX + xShift - this.numWd * 0.2, this.midY - this.numHt / 2, numArray[i], i);
    }
};
Digital.prototype.colon = function(s) {
    var g = this.g;
    var height = this.numHt * 0.15;
    var width = height / 2;
    var margin = height / 3;
    if (s % 2) {
        this.setClr(true);
    } else {
        this.setClr(false);
    }
    if (this.ssQ) {
        g.bar(this.midX - this.numWd - (this.numWd * 1.5), this.midY - margin - height, width, height);
        g.bar(this.midX - this.numWd - (this.numWd * 1.5), this.midY + margin, width, height);
        g.bar(this.midX + this.numWd + (this.numWd * 0.9), this.midY + margin, width, height);
        g.bar(this.midX + this.numWd + (this.numWd * 0.9), this.midY - margin - height, width, height);
    } else {
        g.bar(this.midX, this.midY - margin - height, width, height);
        g.bar(this.midX, this.midY + margin, width, height);
    }
};
Digital.prototype.segment = function(x, y, onQ, position) {
    var g = this.g;
    this.setClr(onQ);
    var startX = x;
    var startY = y;
    var m = this.numHt / 11;
    if (position === 0 || position === 3 || position === 6) {
        var w = this.numHt / 2.75;
        var h = this.numHt / 11;
    } else {
        w = this.numHt / 11;
        h = this.numHt / 2.75;
    }
    switch (position) {
        case 0:
            g.bar(startX + m, startY, w, h);
            break;
        case 1:
            g.bar(startX, startY + m, w, h);
            break;
        case 2:
            g.bar(startX + w + h, startY + m, w, h);
            break;
        case 3:
            g.bar(startX + m, startY + w + h, w, h);
            break;
        case 4:
            g.bar(startX, startY + m + w + h, w, h);
            break;
        case 5:
            g.bar(startX + w + h, startY + m + w + h, w, h);
            break;
        case 6:
            g.bar(startX + m, startY + 2 * w + h + m, w, h);
            break;
    }
};
Digital.prototype.setClr = function(onQ) {
    var g = this.g;
    if (onQ) {
        g.shadowColor = this.edgeClr;
        g.shadowBlur = 33;
        g.fillStyle = this.onClr;
    } else {
        g.shadowBlur = 0;
        g.fillStyle = this.offClr;
    }
};
var Clock = function(canvas, radius) {
    var info = "modified from a clock made by Richard Beddington";
    this.canvas = canvas;
    this.center = {
        x: this.canvas.width * 0.5 / ratio,
        y: this.canvas.height * 0.5 / ratio
    };
    this.secondOpt = {
        color: '#cd151c',
        thickRatio: 0.011,
        forwardRadiusRatio: 0.90,
        backwardRadiusRatio: 0.2
    };
    this.minuteOpt = {
        color: 'rgba(255,0,0,1)',
        thickRatio: 0.06,
        forwardRadiusRatio: 0.75,
        backwardRadiusRatio: 0.25
    };
    this.hourOpt = {
        color: '#44f',
        thickRatio: 0.08,
        forwardRadiusRatio: 0.55,
        backwardRadiusRatio: 0.2
    };
    this.faceOpt = {
        color: '#000',
        numDistRatio: 0.28,
        numSizeRatio: 0.28,
        dotDistRatio: 0.9,
        edgeDistRatio: 0.15,
        thickRatio: 0.005,
        lengthRatio: 0.12,
        keyMarkers: 5,
        keyMarkerThicknessRatio: 0.075,
        keyMarkerLengthRatio: 0.2
    };
    this.radius = radius;
    this.hh = 0;
    this.mm = 0;
    this.ss = 0;
    this.update();
};
Clock.prototype.update = function() {
    this.dt = new Date();
    this.hh = this.dt.getHours() + this.dt.getMinutes() / 60;
    if (this.hh >= 12) this.hh -= 12;
    this.mm = this.dt.getMinutes() + this.dt.getSeconds() / 60;
    this.ss = this.dt.getSeconds() + this.dt.getMilliseconds() / 1000; // for smooth
    this.redraw();
};
Clock.prototype.redraw = function() {
    g2.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawHourHand();
    this.drawMinuteHand();
    this.drawSecondHand();
    this.drawPin();
};
Clock.prototype.drawFace = function() {
    var faceGradient = g.createRadialGradient(this.center.x, this.center.y, 0, this.center.x, this.center.y, this.radius);
    faceGradient.addColorStop(0, "rgba(255, 231, 180, 0)");
    faceGradient.addColorStop(1, "rgba(182, 157, 100, 0.3)");
    g.fillStyle = faceGradient;
    g.beginPath();
    g.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    g.fillStyle = '#fff';
    g.fill();
    g.fillStyle = faceGradient;
    g.fill();
    var edgeGradient = g.createLinearGradient(0, this.center.y - this.radius, 0, this.center.y + this.radius);
    edgeGradient.addColorStop(0, "#999");
    edgeGradient.addColorStop(0.5, "#eef");
    edgeGradient.addColorStop(1, "#999");
    g.fillStyle = edgeGradient;
    g.beginPath();
    g.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    g.closePath();
    g.arc(this.center.x, this.center.y, this.radius + (this.radius * 0.075), 0, 2 * Math.PI, true);
    g.shadowColor = 'rgba(0,0,0,0.7)';
    g.shadowBlur = this.radius * 0.3;
    g.shadowOffsetY = 1;
    g.fill();
    g.shadowBlur = 0;
    g.shadowOffsetY = 0;
};
Clock.prototype.drawPin = function() {
    g2.fillStyle = '#888';
    g2.beginPath();
    g2.arc(this.center.x, this.center.y, 4, 0, 2 * Math.PI);
    g2.fill();
};
Clock.prototype.drawMinuteMarkers = function() {
    g.font = ' ' + ((this.radius * this.faceOpt.numSizeRatio) >> 0) + 'px Arial';
    g.textAlign = "center";
    g.fillStyle = '#444';
    var i = 1,
        dotSize = 2;
    while (i <= 60) {
        var angle = (Math.PI * 2) * (-i / 60);
        var dotRad = this.radius * this.faceOpt.dotDistRatio;
        var dotX = Math.sin(angle) * dotRad + this.center.x;
        var dotY = Math.cos(angle) * dotRad + this.center.y;
        if (i % this.faceOpt.keyMarkers) {
            dotSize = 1;
        } else {
            dotSize = 3;
            g.fillStyle = "#004";
            g.strokeStyle = '#fff';
            g.lineWidth = 1;
            var numRad = this.radius * (1 - this.faceOpt.numDistRatio);
            var numX = Math.sin(angle) * numRad + this.center.x;
            var numY = Math.cos(angle) * numRad + this.center.y + this.radius * 0.09;
            var h = Math.floor(i / 5) + 6;
            if (h > 12) h -= 12;
            g.font = ' ' + ((this.radius * this.faceOpt.numSizeRatio) >> 0) + 'px Arial';
            g.fillText(h.toString(), numX, numY);
            numX = Math.sin(angle) * numRad * 0.7 + this.center.x;
            numY = Math.cos(angle) * numRad * 0.7 + this.center.y + this.radius * 0.05;
            if (0) {
                h += 12;
                if (h == 24) h = '00';
                g.font = ' ' + ((0.5 * this.radius * this.faceOpt.numSizeRatio) >> 0) + 'px Arial';
                g.fillStyle = 'black';
                g.fillText(h.toString(), numX, numY);
            }
        }
        g.fillStyle = '#444';
        g.beginPath();
        g.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
        g.fill();
        i++;
    }
};
Clock.prototype.getSecondAngle = function() {
    return Math.PI * 2 * (-this.ss / 60);
};
Clock.prototype.drawSecondHand = function() {
    this.drawHand(this.getSecondAngle(), this.secondOpt);
};
Clock.prototype.getMinuteAngle = function() {
    return (Math.PI * 2) * (-this.mm / 60);
};
Clock.prototype.drawMinuteHand = function() {
    this.drawHand(this.getMinuteAngle(), this.minuteOpt);
};
Clock.prototype.getHourAngle = function() {
    return (Math.PI * 2) * (-this.hh / 12);
};
Clock.prototype.drawHourHand = function() {
    this.drawHand(this.getHourAngle(), this.hourOpt);
};
Clock.prototype.drawHand = function(angle, handOptions) {
    var back = this.radius * handOptions.backwardRadiusRatio;
    var fore = this.radius * handOptions.forwardRadiusRatio;
    var thk = handOptions.thickRatio * this.radius / 2;
    var sina = Math.sin(angle);
    var cosa = Math.cos(angle);
    var xys = [
        [-thk, back],
        [thk, back],
        [thk, -fore + thk * 2],
        [0, -fore - thk * 2],
        [-thk, -fore + thk * 2]
    ];
    for (var i = 0, len = xys.length; i < len; i++) {
        xy = xys[i];
        var xPos = xy[0] * cosa + xy[1] * sina;
        var yPos = -xy[0] * sina + xy[1] * cosa;
        xy[0] = xPos + this.center.x;
        xy[1] = yPos + this.center.y;
    }
    var g = g2;
    g.shadowColor = 'rgba(0,0,0,0.8)';
    g.shadowBlur = this.radius * 0.1;
    g.shadowOffsetY = this.radius * 0.05;
    g.fillStyle = handOptions.color;
    g.beginPath();
    for (i = 0, len = xys.length; i < len; i++) {
        var xy = xys[i];
        if (i == 0) {
            g.moveTo(xy[0], xy[1]);
        } else {
            g.lineTo(xy[0], xy[1]);
        }
    }
    g.closePath();
    g.fill();
    g.shadowBlur = 0;
    g.shadowOffsetY = 0;
};

function isNear(a, b, tol) {
    return Math.abs(a - b) <= tol;
}

function dist(dx, dy) {
    return (Math.sqrt(dx * dx + dy * dy));
}
CanvasRenderingContext2D.prototype.bar = function(x, y, w, h) {
    if (h < w) {
        this.beginPath();
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w + h / 2, y + h / 2);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x - h / 2, y + h / 2);
        this.closePath();
        this.fill();
    } else {
        this.beginPath();
        this.moveTo(x, y);
        this.lineTo(x + w / 2, y - w / 2);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x + w / 2, y + h + w / 2);
        this.lineTo(x, y + h);
        this.closePath();
        this.fill();
    }
};
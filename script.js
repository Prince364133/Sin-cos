const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;

var viewWidth = 1024;
var viewHeight = 480;
var drawingCanvas, ctx;
var speed = 60;
var timeStep = (1/speed);
var time = 0;
var radius = 100;
var points = [];

initDrawingCanvas();
initGUI();

function initGUI() {
    var gui = new dat.GUI();

    gui.add(window, "radius", 20, 100);
    gui.add(window, "speed", 1, 120).onChange(function() {
        timeStep = (1 / (121 - speed));
    });
}

function initDrawingCanvas() {
    drawingCanvas = document.getElementById("drawing_canvas");
    drawingCanvas.width = viewWidth;
    drawingCanvas.height = viewHeight;
    ctx = drawingCanvas.getContext('2d');
}

function draw() {
    // update points
    var x = -Math.sin(time) * radius + 120;
    var y = Math.cos(time) * radius + 120;

    points.unshift({x:x, y:y});
    if (points.length > 4096) points.pop();

    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    clear();
    drawBackground();
    drawProjectionLines(x, y);

    // draw line from circle center to [x, y]
    ctx.strokeStyle = "#fff";
    drawLine(120, 120, x, y);

    // draw little circles at intersections
    ctx.fillStyle = "#fff";
    drawCircleFill(x, y, 5);

    ctx.fillStyle = "#f0f";
    drawCircleFill(240, y, 5);

    ctx.fillStyle = "#0ff";
    drawCircleFill(x, 240, 5);
    drawCircleFill(240, 480 - x, 5);

    // draw the waves
    drawSinWave();
    drawCosWave();

    // next frame
    time += timeStep;
    requestAnimationFrame(draw);
}

function clear() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, viewWidth, viewHeight);
}

function drawBackground() {
    var dividerCount = Math.ceil((viewWidth - 240) / (radius * Math.PI)) * 2,
        dividerX;

    // top graph
    ctx.strokeStyle = '#333';
    drawLine(120, 120 - radius, viewWidth, 120 - radius);
    drawLine(0, 120, viewWidth, 120);
    drawLine(120, 120 + radius, viewWidth, 120 + radius);
    // bottom graph
    drawLine(240, 360 - radius, viewWidth, 360 - radius);
    drawLine(240, 360, viewWidth, 360);
    drawLine(240, 360 + radius, viewWidth, 360 + radius);
    drawLine(120 - radius, 120, 120 - radius, 240);
    drawLine(120, 0, 120, 240);
    drawLine(120 + radius, 120, 120 + radius, 240);
    // arcs
    drawArc(240, 240, 120 - radius, HALF_PI, Math.PI);
    drawArc(240, 240, 120, HALF_PI, Math.PI);
    drawArc(240, 240, 120 + radius, HALF_PI, Math.PI);
    // vertical dividers
    for (var i = 0; i < dividerCount; i++) {
        dividerX = 240 + radius * HALF_PI * i;
        dividerX += radius * (time % HALF_PI);

        drawLine(dividerX, 0, dividerX, 480);
    }
    // circle and axis
    ctx.strokeStyle = '#777';
    drawLine(240, 0, 240, viewHeight);
    drawLine(0, 240, viewWidth, 240);
    drawCircleStroke(120, 120, radius);
}

function drawProjectionLines(x, y) {
    // draw lines connecting the circle and waves
    ctx.setLineDash([5]);

    ctx.strokeStyle = '#f0f';
    drawLine(x, y, 240, y);

    ctx.strokeStyle = '#0ff';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, 240);
    ctx.arcTo(x, 480 - x, 240, 480 - x, 240 - x);
    ctx.stroke();

    ctx.setLineDash([]);
}

function drawSinWave() {
    ctx.strokeStyle = "#f0f";
    ctx.beginPath();

    for (var i = 0; i < points.length; i++) {
        ctx.lineTo(i * timeStep * (radius) + 240, points[i].y);
    }

    ctx.stroke();
}

function drawCosWave() {
    ctx.strokeStyle = "#0ff";
    ctx.beginPath();

    for (var j = 0; j < points.length; j++) {
        ctx.lineTo(240 + j * timeStep * radius, -points[j].x + 480);
    }

    ctx.stroke();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawCircleFill(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TWO_PI);
    ctx.fill();
}

function drawCircleStroke(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TWO_PI);
    ctx.stroke();
}

function drawArc(x, y, r, s, e) {
    ctx.beginPath();
    ctx.arc(x, y, r, s, e);
    ctx.stroke();
}

requestAnimationFrame(draw);
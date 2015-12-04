var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width = window.innerWidth;
var height = ctx.canvas.height = window.innerHeight;
var rightButtonClicked = false;
var leftButtonClicked = false;
var mouseX, mouseY;
var time = 0;

if (width > height)
  width = height;
else
  height = width;

var res = {
  x: 120,
  y: 120
};

var block = {
  x: Math.floor(width / res.x),
  y: Math.floor(height / res.y)
};

var sand = [];
initArray();
requestAnimationFrame(loop);

function addPixel(x, y) {
  sand[from2D(x, y)] = true;
}

function removePixel(x, y) {
  sand[from2D(x, y)] = null;
}

function from2D(x, y) {
  if (x < 0 || x > res.x || y < 0 || y > res.y)
    return true;
  return y * res.x + x;
}

canvas.addEventListener("mouseover", function(e) {
  e.preventDefault();
  mouseX = Math.floor(e.pageX / block.x);
  mouseY = Math.floor(e.pageY / block.y);
  if (e.button === 0) {
    addPixel(mouseX, mouseY);
    leftButtonClicked = true;
  } else if (e.button === 1) {
    removePixel(mouseX, mouseY);
    rightButtonCLicked = true;
  }
}, false);

canvas.addEventListener("mousemove", function(e) {
  if (rightButtonClicked || leftButtonClicked) {
    mouseX = Math.floor(e.pageX / block.x);
    mouseY = Math.floor(e.pageY / block.y);
  }
}, false);

canvas.addEventListener("mouseup", function(e) {
  if (e.button === 0)
    leftButtonClicked = false;
  else if (e.button === 1)
    rightButtonClicked = false;
}, false);

function loop() {
  if (leftButtonClicked) {
    addPixel(mouseX, mouseY);
  } else if (rightButtonClicked) {
    removePixel(mouseX, mouseY);
  }
  if (time >= 1) {
    time = 20;
    computeSand();
  }
  drawSand();
  requestAnimationFrame(loop);
  time += 1;
}

function drawSand() {
  ctx.fillStyle = "#CDB38B";
  ctx.clearRect(0, 0, width, height);
  var y, x;
  for (y = 0; y < res.y; y++) {
    for (x = 0; x < res.x; x++) {
      var e = sand[from2D(x, y)];
      if (e) {
        ctx.fillRect(x * block.x, y * block.y, block.x, block.y);
      }
    }
  }
}

function computeSand() {
  var y, x;
  for (y = res.y - 2; y >= 0; y--) {
    for (x = res.x - 1; x >= 0; x--) {
      var i = from2D(x, y);
      var bottomI = from2D(x, y + 1);

      if (sand[i]) {
        if (!sand[bottomI]) {
          sand[bottomI] = true;
          sand[i] = null;
        } else {
          var leftI = from2D(x - 1, y + 1);
          var rightI = from2D(x + 1, y + 1);
          if (!sand[leftI] && !sand[rightI]) {
            if (Math.random() <= 0.5)
              sand[leftI] = true;
            else
              sand[rightI] = true;

            sand[i] = null;
          } else if (!sand[leftI]) {
            sand[leftI] = true;
            sand[i] = null;
          } else if (!sand[rightI]) {
            sand[rightI] = true;
            sand[i] = null;
          }
        }
      }
    }
  }
}

function initArray() {
  var y, x;
  for (y = 0; y < res.y; y++) {
    for (x = 0; x < res.x; x++) {
      sand[y * res.y + x] = null;
      if (Math.random() * 10 > 8)
        sand[y * res.y + x] = true;
    }
  }
}

// display.js
// Ryan Stonebraker
// Last Edit 11/6/2016
// graphical display of robot

//  Boundaries
//    Robot 1.5 m by .75 m
//    Container 7.38 m long by 3.88 m wide
//    Obstacle Start = 1.5 m from Start
//    Mining Start = 4.44 m from Start

// create property to check if telemetry received?

// 1 cm to 1 px scale

// stop button
// better simulator
// more room for additional data

var field = {
  "scale" : 1,
  "width" : 388,
  "height" : 0,
  "obstacleStart" : 150,
  "miningStart" : 444,
  collectorBin : {
    "width" : 165,
    "height" : 48
  }
}
field.height = 738 + field.collectorBin.height;

// temp keycodes if no telemetry
var key = {
    "left" : "A".charCodeAt(),
    "right" : "D".charCodeAt(),
    "down" : "S".charCodeAt(),
    "up" : "W".charCodeAt()
  };

var ctx;
var canvas;
var overlayCanvas;
var overlayCtx;

// overarching object literal for robot
var robot =
{
    "img" : new Image(),
    dimension :
    {
        "width" : 150,
        "height" : 75
    },
    telemetry : {
      location : {
        "x" : 0,
        "y" : 0,
        "angle" : 0,
      },
      power : {
        "left" : 0,
        "right" : 0,
        "mine" : 0,
        "dump" : 0,
        "roll" : 0,
        "stop" : false
      },
      get telemCheck ()
      {
        return (this.location.x || this.location.y || this.location.angle);
      }
    },
    power : {
        "left" : 0,
        "right" : 0,
        "mine" : 0,
        "dump" : 0,
        "roll" : 0,
        "powerLimit":0.3,
        "highPowerLimit":0.7,
        "highPower":false,
        "mineLimit":0.3
      },
    screen :
    {
        "x" : 0,
        "y" : 0,
        "oldX" : 0,
        "oldY" : 0,
        "velocity" : 20,
        "angle" : 0,
        "oldAngle" : 0,
        "angadjust" : 15,
        get xMid ()
        {
            return this.x + robot.dimension.width/2;
        },
        get yMid ()
        {
            return this.y - robot.dimension.height/2;
        },
        "trail" : { // arrays to store track location for bottom left/right x/y
          "lX" : new Array (15),
          "rX" : new Array (15),
          "lY" : new Array (15),
          "rY" : new Array (15),
          "num" : 15 // change this to match num items in array
        }
    },
    corner :
    {
      get localRad ()
      {
        return Math.atan(robot.dimension.height/robot.dimension.width);
      },
      get rotRad ()
      {
        return robot.screen.angle * Math.PI/180;
      },
      get hyp ()
      {
        return Math.sqrt((robot.dimension.width*robot.dimension.width)/4 +
               (robot.dimension.height*robot.dimension.height)/4);
      },
      get bottomRight ()
      {
        var x = robot.screen.xMid + this.hyp * Math.cos(this.localRad - this.rotRad);
        var y = robot.screen.yMid + this.hyp * Math.sin(this.localRad - this.rotRad);
        return {x: x, y: y};
      },
      get topRight ()
      {
        var x = robot.screen.xMid + this.hyp * Math.cos(this.localRad + this.rotRad);
        var y = robot.screen.yMid - this.hyp * Math.sin(this.localRad + this.rotRad);
        return {x: x, y: y};
      },
      get topLeft ()
      {
        var x = robot.screen.xMid - this.hyp * Math.cos(this.localRad - this.rotRad);
        var y = robot.screen.yMid - this.hyp * Math.sin(this.localRad - this.rotRad);
        return {x: x, y: y};
      },
      get bottomLeft ()
      {
        var x = robot.screen.xMid - this.hyp * Math.cos(this.localRad + this.rotRad);
        var y = robot.screen.yMid + this.hyp * Math.sin(this.localRad + this.rotRad);
        return {x: x, y: y};
      }
    }

};

// declare starting values independent of telemetry
robot.img.src = "img/robot.svg";
robot.screen.x = field.width/2 - (robot.dimension.width)/2;
robot.screen.y = field.height - field.collectorBin.height;
robot.screen.oldX = robot.screen.x;
robot.screen.oldY = robot.screen.y;
// end start val declare

// robot display "class" w/prototype syntax
function robot_display (rMapDiv, oMapDiv)
{
  if (!rMapDiv || !oMapDiv)
    return null;

  this.rMapDiv = rMapDiv;
  this.oMapDiv = oMapDiv;

  canvas = this.rMapDiv;

  // overlay canvas for obstacles and trail
  overlayCanvas = this.oMapDiv;

  if (canvas.getContext)
  {
    ctx = canvas.getContext("2d");
    overlayCtx = overlayCanvas.getContext("2d");

    // make robotMap and canvasOverlay canvas size of field
    // scale does not change field size
    canvas.width = field.width * field.scale;
    canvas.height = field.height * field.scale;
    overlayCanvas.width = field.width * field.scale;
    overlayCanvas.height = field.height * field.scale;

    // 1 cm width to 1 px width, 1 cm height to 1 px height
    ctx.scale(field.scale,field.scale);
    overlayCtx.scale(field.scale,field.scale);

    ctx.fillStyle = "#D7D2CB";
    ctx.rect(0, 0, field.width, field.height);
    ctx.fill();
  }

  this.canvas_update();

  window.addEventListener('keydown', this.arrow_key.bind(this), true);
}

// canvas 0,0 at top left, robot 0,0 at bottom left --translate
 robot_display.prototype.sY_from_rY = function(yPos) // screen y pos from robot y pos
{
  return field.height - (yPos + field.collectorBin.height);
}

robot_display.prototype.sX_from_rX = function (xPos) // screen x pos from robot x pos
{
  return field.width/2 + (xPos + field.collectorBin.height);
}

robot_display.prototype.obj_update = function (xMid, yMid, width, height, deg)
{
    var rad = -deg * Math.PI/180;

    if(!this.checkBounds ())
      return;

    ctx.save();

    ctx.fillRect(0, 0, field.width, field.height);
    // center canvas on robot, rotate canvas to degree, draw, move canvas back
    ctx.translate (xMid, yMid);
    ctx.rotate (rad);

    ctx.drawImage (robot.img, -width/2, -height/2);
    //ctx.strokeRect (-width/2, -height/2, width, height);

    ctx.restore();
}

robot_display.prototype.checkBounds = function ()
{
  var fieldHeight = field.height - field.collectorBin.height;
  var x0 = robot.corner.bottomLeft.x < 0 || robot.corner.bottomRight.x < 0 ||
           robot.corner.topLeft.x < 0 || robot.corner.topRight.x < 0;
  var xW = robot.corner.bottomLeft.x > field.width ||
           robot.corner.bottomRight.x > field.width ||
           robot.corner.topLeft.x > field.width ||
           robot.corner.topRight.x > field.width;
  var y0 = robot.corner.bottomLeft.y < 0 || robot.corner.bottomRight.y < 0 ||
           robot.corner.topLeft.y < 0 || robot.corner.topRight.y < 0;
  var yH = robot.corner.bottomLeft.y > fieldHeight ||
           robot.corner.bottomRight.y > fieldHeight ||
           robot.corner.topLeft.y > fieldHeight ||
           robot.corner.topRight.y > fieldHeight;

  if (x0 || xW || y0 || yH)
  {
    robot.screen.y = robot.screen.oldY;
    robot.screen.x = robot.screen.oldX;
    robot.screen.angle = robot.screen.oldAngle;
    return false;
  }

  // draw tracks if in bounds and if isn't the same as last
  if (robot.screen.x != robot.screen.oldX ||
      robot.screen.angle != robot.screen.oldAngle ||
      robot.screen.y != robot.screen.oldY)
    this.drawTrack (robot.corner.bottomLeft, robot.corner.bottomRight);

  robot.screen.oldX = robot.screen.x;
  robot.screen.oldY = robot.screen.y;
  robot.screen.oldAngle = robot.screen.angle;
  return true;
}

robot_display.prototype.divideScreen = function (l1, l2, w)
{
  l1 = this.sY_from_rY(l1);
  l2 = this.sY_from_rY(l2);
  var l3 = this.sY_from_rY(0);
  overlayCtx.strokeStyle = "#000000";
  overlayCtx.strokeRect (0, l1, w, 1);
  overlayCtx.strokeRect (0, l2, w, 1);
  overlayCtx.strokeRect (0, l3, w, 1);
}

robot_display.prototype.drawTrack = function (bottomLeft, bottomRight)
{
  overlayCtx.clearRect (0, 0, field.width, field.height);

    var iterateXY = [robot.screen.trail.lX, robot.screen.trail.rX,
                     robot.screen.trail.lY, robot.screen.trail.rY];
    var currentXY = [robot.corner.bottomLeft.x, robot.corner.bottomRight.x,
                     robot.corner.bottomLeft.y, robot.corner.bottomRight.y];

    for (var j = 0; j < 4; j++)
    {
      var cArray = iterateXY[j];

      var tempArray = [];
      for (var k = 0; k < cArray.length; k++)
      {
        tempArray.push(cArray[k]);

        if (k == 0)
        {
          cArray[0] = currentXY[j];
          continue;
        }
          cArray[k] = tempArray[k-1];
      }
    }

  for (var i = 0, trails = robot.screen.trail.num; i < trails; i++)
  {
  overlayCtx.strokeStyle = "blue";
  overlayCtx.strokeRect(robot.screen.trail.rX[i], robot.screen.trail.rY[i], 1, 1);
  overlayCtx.strokeRect(robot.screen.trail.lX[i], robot.screen.trail.lY[i], 1, 1);
  }
}

robot_display.prototype.canvas_update = function ()
{
  var self = this;
  requestAnimationFrame(function(){self.canvas_update();});

  if (robot.telemetry.telemCheck)
  {
    // currently getting x as bottom left, 0 degrees to the right
    // NOTE x position of robot can be -194 to (194-150) due to
    // robots width
    robot.screen.x = this.sX_from_rX(robot.telemetry.location.x);
    robot.screen.y = this.sY_from_rY(robot.telemetry.location.y);
    robot.screen.angle = -robot.telemetry.location.angle;

    // if hits edge and stays there, wont change color- new robot not drawn
    if (robot.telemetry.power.mine > 45)
      robot.img.src = "img/robot_mine.svg";
    else
      robot.img.src = "img/robot.svg";

  }

  this.obj_update(robot.screen.xMid, robot.screen.yMid, robot.dimension.width,
                  robot.dimension.height, robot.screen.angle);
  this.drawCollectorBin();
  this.divideScreen (field.obstacleStart, field.miningStart, field.width);
}

robot_display.prototype.drawCollectorBin = function()
{
  var absBottom = this.sY_from_rY(0);
  overlayCtx.fillStyle = "darkgray";
  overlayCtx.fillRect (field.width/2 - field.collectorBin.width/2, absBottom,
                       field.collectorBin.width, field.collectorBin.height);
}

robot_display.prototype.arrow_key = function (evt)
{
  if (!robot.telemetry.telemCheck)
  {
  switch (evt.keyCode)
  {
        case key.left:
            robot.screen.angle += robot.screen.angadjust;
            break;
        case key.right:
            robot.screen.angle -= robot.screen.angadjust;
            break;
        case key.down:
            robot.screen.x += robot.screen.velocity *
                          Math.sin (robot.screen.angle * Math.PI/180);
            robot.screen.y += robot.screen.velocity *
                          Math.cos (robot.screen.angle * Math.PI/180);
            evt.preventDefault();
            break;
        case key.up:
            robot.screen.x -= robot.screen.velocity *
                          Math.sin (robot.screen.angle * Math.PI/180);
            robot.screen.y -= robot.screen.velocity *
                          Math.cos (robot.screen.angle * Math.PI/180);
            evt.preventDefault();
            break;
  }
}
}

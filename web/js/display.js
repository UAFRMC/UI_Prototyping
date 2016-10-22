// display.js
// Ryan Stonebraker
// Last Edit 10/21/2016
// graphical display of robot

//  Boundaries
//    Robot 1.5 m by .75 m
//    Container 7.38 m long by 3.88 m wide
//    Obstacle Start = 1.5 m from Start
//    Mining Start = 4.44 m from Start

// wheel trails /
// change canvas size from js /
// bounds /
// robot icon

// create property to check if telemetry received?

// 1 cm to 1 px scale
var field = {
  "width" : 388,
  "height" : 738,
  "obstacleStart" : 150,
  "miningStart" : 444
}

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

// add telemetry
var robot =
{
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
        "roll" : 0
      },
      get telemCheck ()
      {
        return (this.location.x || this.location.y || this.location.angle);
      }
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
robot.screen.x = field.width/2 - (robot.dimension.width)/2;
robot.screen.y = field.height;
robot.screen.oldX = robot.screen.x;
robot.screen.oldY = robot.screen.y;
// end start val declare

function visual_canvas ()
{
  canvas = document.getElementById("robotMap");

  // overlay canvas for obstacles and trail
  overlayCanvas = document.getElementById("overlayMap");

  if (canvas.getContext)
  {
    ctx = canvas.getContext("2d");
    overlayCtx = overlayCanvas.getContext("2d");

    ctx.scale (1,1); // 1 cm width to 1 px width, 1 cm height to 1 px height

    // make robotMap and canvasOverlay canvas size of field
    canvas.width = field.width;
    canvas.height = field.height;
    overlayCanvas.width = field.width;
    overlayCanvas.height = field.height;

    ctx.fillStyle = "#D7D2CB";
    ctx.rect(0, 0, field.width, field.height);
    ctx.fill();
  }

  canvas_update();

  window.addEventListener('keydown', arrow_key, true);
}

// canvas 0,0 at top left, robot 0,0 at bottom left --translate
function sY_from_rY (yPos) // screen y pos from robot y pos
{
  return field.height - yPos;
}

function obj_update (xMid, yMid, width, height, deg)
{
    var rad = -deg * Math.PI/180;

    if(!checkBounds ())
      return;

    ctx.save();

    ctx.fillRect(0, 0, field.width, field.height);
    // center canvas on robot, rotate canvas to degree, draw, move canvas back
    ctx.translate (xMid, yMid);
    ctx.rotate (rad);

    ctx.strokeRect (-width/2, -height/2, width, height);

    ctx.restore();
}

function checkBounds ()
{
  // TODO Clean up
  if (robot.corner.bottomLeft.x < 0 || robot.corner.bottomLeft.x > field.width)
  {
    robot.screen.y = robot.screen.oldY;
    robot.screen.x = robot.screen.oldX;
    robot.screen.angle = robot.screen.oldAngle;
    return false;
  }
  if (robot.corner.bottomRight.x < 0 || robot.corner.bottomRight.x > field.width)
  {
    robot.screen.y = robot.screen.oldY;
    robot.screen.x = robot.screen.oldX;
    robot.screen.angle = robot.screen.oldAngle;
    return false;
  }
  if (robot.corner.topLeft.x < 0 || robot.corner.topLeft.x > field.width)
  {
    robot.screen.y = robot.screen.oldY;
    robot.screen.x = robot.screen.oldX;
    robot.screen.angle = robot.screen.oldAngle;
    return false;
  }
  if (robot.corner.topRight.x < 0 || robot.corner.topRight.x > field.width)
  {
    robot.screen.y = robot.screen.oldY;
    robot.screen.x = robot.screen.oldX;
    robot.screen.angle = robot.screen.oldAngle;
    return false;
  }
  if (robot.corner.bottomLeft.y < 0 || robot.corner.bottomLeft.y > field.height)
  {
    robot.screen.y = robot.screen.oldY;
    robot.screen.x = robot.screen.oldX;
    robot.screen.angle = robot.screen.oldAngle;
    return false;
  }
  if (robot.corner.bottomRight.y < 0 || robot.corner.bottomRight.y > field.height)
  {
    robot.screen.y = robot.screen.oldY;
    robot.screen.x = robot.screen.oldX;
    robot.screen.angle = robot.screen.oldAngle;
    return false;
  }
  if (robot.corner.topLeft.y < 0 || robot.corner.topLeft.y > field.height)
  {
    robot.screen.y = robot.screen.oldY;
    robot.screen.x = robot.screen.oldX;
    robot.screen.angle = robot.screen.oldAngle;
    return false;
  }
  if (robot.corner.topRight.y < 0 || robot.corner.topRight.y > field.height)
  {
    robot.screen.y = robot.screen.oldY;
    robot.screen.x = robot.screen.oldX;
    robot.screen.angle = robot.screen.oldAngle;
    return false;
  }

  robot.screen.oldX = robot.screen.x;
  robot.screen.oldY = robot.screen.y;
  robot.screen.oldAngle = robot.screen.angle;
  return true;
}

function divideScreen (l1, l2, w)
{
  l1 = sY_from_rY(l1);
  l2 = sY_from_rY(l2);
  overlayCtx.strokeStyle = "#000000";
  overlayCtx.strokeRect (0, l1, w, 1);
  overlayCtx.strokeRect (0, l2, w, 1);
}

function drawTrack (bottomLeft, bottomRight)
{
  overlayCtx.strokeStyle = "blue";
  overlayCtx.strokeRect(robot.corner.bottomRight.x, robot.corner.bottomRight.y, 1, 1);
  overlayCtx.strokeRect(robot.corner.bottomLeft.x, robot.corner.bottomLeft.y, 1, 1);
}

function canvas_update ()
{
  requestAnimationFrame(canvas_update);

  if (robot.telemetry.telemCheck)
  {
    // TODO connect telemetry
    robot.screen.x = robot.telemetry.location.x;
    robot.screen.y = sY_from_rY(robot.telemetry.location.y);
    robot.screen.angle = robot.telemetry.location.angle;
  }

  obj_update(robot.screen.xMid, robot.screen.yMid, robot.dimension.width,
             robot.dimension.height, robot.screen.angle);

  divideScreen (field.obstacleStart, field.miningStart, field.width);

  drawTrack (robot.corner.bottomLeft, robot.corner.bottomRight);
}

function arrow_key (evt)
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

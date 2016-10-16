//  Boundaries
//      Robot 1.5 m by .75 m
//      Container 7.38 m long by 3.88 m wide

// TODO divide canvas into dumping area by rules, make location of lines for div
// in object, modify telemetry receiving, change scale to 1 cm = 1px, make Scale
// part of setup up object for easy adjusting, shift 0,0 to bottom left

// canvas properties
var field = {
  "scale" : 0.01, // 1 px equals X meters
  "width" : 3.88,
  "height" : 7.38,
  "robot" : {
    "width" : 1.5,
    "height" : .75
  }
}

var setup =
{
  "width" : field.width/field.scale,
  "height" : field.height/field.scale,
  "key" : {
    "left" : 37,
    "right" : 39,
    "down" : 40,
    "up" : 38
  }
};

var ctx;
var canvas;

// overarching object literal for robot
var robot =
{
    setup :
    {
        "width" : field.robot.width/field.scale,
        "height" : field.robot.height/field.scale
    },
    location :
    {
        "x" : setup.width/2 - (field.robot.width/field.scale)/2,
        "y" : setup.height + (field.robot.height/field.scale)/2,
        "restoreX" : setup.width/2 - (field.robot.width/field.scale)/2,
        "restoreY" : setup.height + (field.robot.height/field.scale)/2,
        "velocity" : 20,
        "angle" : 0,
        "angadjust" : 15,
        get xMid ()
        {
            return this.x + robot.setup.width/2;
        },
        get yMid ()
        {
            return this.y - robot.setup.height/2;
        }
    }
};

function visual_canvas ()
{
    canvas = document.getElementById("robotMap");

  if (canvas.getContext)
  {
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#D7D2CB";
    ctx.rect(0, 0, setup.width, setup.height);
    ctx.fill();
  }

    canvas_update();

    window.addEventListener('keydown', arrow_key, true);
}

function obj_update (xMid, yMid, width, height, deg)
{
    var rad = -deg * Math.PI/180;
    var xRestore = -(xMid + width/2);
    var yRestore = -(yMid + height/2);

    if(!checkBounds (xMid, yMid, deg))
      return;

    ctx.save();
    ctx.fillRect(0, 0, setup.width, setup.height);

    // center canvas on robot, rotate canvas to degree, draw, move canvas back
    ctx.translate (xMid, yMid);
    ctx.rotate (rad);

    ctx.translate (xRestore, yRestore);

    ctx.strokeRect (xMid, yMid, width, height);

    ctx.restore();
}

function checkBounds (xMid, yMid, angle)
{
  if (xMid <= 0 || xMid >= setup.width || yMid <= 0 || yMid >= setup.height)
  {
    robot.location.y = robot.location.restoreY;
    robot.location.x = robot.location.restoreX;
    return false;
  }

  robot.location.restoreX = robot.location.x;
  robot.location.restoreY = robot.location.y;
  return true;
}

function canvas_update ()
{
  requestAnimationFrame(canvas_update);
  obj_update(robot.location.xMid, robot.location.yMid, robot.setup.width,
             robot.setup.height, robot.location.angle);
}

function arrow_key (evt)
{

  switch (evt.keyCode)
  {
        case setup.key.left:
            robot.location.angle += robot.location.angadjust;
            break;
        case setup.key.right:
            robot.location.angle -= robot.location.angadjust;
            break;
        case setup.key.down:
            robot.location.x += robot.location.velocity *
                          Math.sin (robot.location.angle * Math.PI/180);
            robot.location.y += robot.location.velocity *
                          Math.cos (robot.location.angle * Math.PI/180);
            evt.preventDefault();
            break;
        case setup.key.up:
            robot.location.x -= robot.location.velocity *
                          Math.sin (robot.location.angle * Math.PI/180);
            robot.location.y -= robot.location.velocity *
                          Math.cos (robot.location.angle * Math.PI/180);
            evt.preventDefault();
            break;
  }
}

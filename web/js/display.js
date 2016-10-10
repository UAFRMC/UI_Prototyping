//  Boundaries
//      Robot 1.5 m by .75 m
//      Container 7.38 m long by 3.88 m wide
//  Scale: 2/3 pixel = 1 cm
//      Adjusted Container Size: 490 pixels by 259
//      Adjusted Robot Size = 75 pixels by 38 pixels
//  284.9 x 539 - Scale 11/15 pixel = 1 cm

// canvas properties
var setup = 
{
  "width" : 259,
  "height" : 490,
  "left" : 37,
  "right" : 39,
  "down" : 40,
  "up" : 38
};

var ctx;
var canvas;

// overarching object literal for robot
var robot = 
{
    setup : 
    {
        "width" : 75,
        "height" : 38
    },
    location : 
    {
        "x" : setup.width/2 - 75/2,
        "y" : setup.height/2 + 38/2,
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
    },
    corners : 
    {
        get tL () 
        {

        },
    get tR () 
        {

        },
    get bL () 
        {

        },
    get bR () 
        {

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

    ctx.save();
    ctx.fillRect(0, 0, setup.width, setup.height);

    // center canvas on robot, rotate canvas to degree, draw, move canvas back
    ctx.translate (xMid, yMid);
    ctx.rotate (rad);

    ctx.translate (xRestore, yRestore);

    ctx.strokeRect (xMid, yMid, width, height);

    ctx.restore();
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
        case setup.left:
            robot.location.angle += robot.location.angadjust;
      // bounds?
        break;
        case setup.right:
            robot.location.angle -= robot.location.angadjust;
      // bounds?
        break;
        case setup.down:
            robot.location.x += robot.location.velocity *
                          Math.sin (robot.location.angle * Math.PI/180);
            robot.location.y += robot.location.velocity *
                          Math.cos (robot.location.angle * Math.PI/180);
      // bounds?
        break;
        case setup.up:
            robot.location.x -= robot.location.velocity *
                          Math.sin (robot.location.angle * Math.PI/180);
            robot.location.y -= robot.location.velocity *
                          Math.cos (robot.location.angle * Math.PI/180);
      // bounds?
        break;
  }
}

// sideview.js
// Ryan Stonebraker
// Created 10/30/2016
// Last Updated 11/6/2016
// Graphical side view of robot in sideview canvas

var sCtx;
var sCanvas;

function side_Display (div, robot)
{
  if (!div)
    return null;
  this.div = div;
  this.power = robot.telemetry.power;
  this.dimension = robot.dimension;

  sCanvas = this.div;
  if (sCanvas.getContext)
  {
    sCtx = sCanvas.getContext("2d");

    sCanvas.width = 200;
    sCanvas.height = 125;

    sCtx.fillStyle = "#D7D2CB";
    sCtx.fillRect(0, 0, 200, 125);
  }
  this.side_Update();
}

side_Display.prototype.mining_rotate = function (angle)
{
  var rad = -angle * Math.PI/180;
  var width = this.dimension.height;
  var height = this.dimension.height;
  var xMid = sCanvas.width/2;
  var yMid = sCanvas.height/2;

  // placeholder vars for sensor looking into bag
  var maxMine = 90; // placeholder heigth of bag
  var mineAmt = this.power.mine/maxMine; // this.power.mine used to represent depth

  sCtx.save();

  sCtx.fillStyle = "#D7D2CB";
  sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
  sCtx.translate (xMid, yMid);
  sCtx.rotate (rad);

  sCtx.strokeRect (-width/2, -height/2, width, height);

  sCtx.fillStyle = "black";
  sCtx.fillRect (-width/2, -height/2, width, height);
  sCtx.fillStyle = "#D7D2CB";
  sCtx.fillRect (-width/2, -height/2, width, (1-mineAmt) * height); // fill from top

  // arrow pointing to top of robot side
  sCtx.fillStyle = "darkgray";
  sCtx.beginPath();
  sCtx.moveTo(0, -height/2);
  sCtx.lineTo(-width/4, -height/3);
  sCtx.lineTo(width/4, -height/3);
  sCtx.closePath();
  sCtx.fill();

  sCtx.restore();
}

side_Display.prototype.side_Update = function ()
{
  var self = this;
  requestAnimationFrame(function(){self.side_Update();});

  // draw robot at specified orientation and graphically show mining amt
  this.mining_rotate(this.power.mine);
}

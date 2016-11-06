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
  var maxMine = 90; // placeholder for maximum mining amount
  var mineAmt = this.power.mine/maxMine;

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
  sCtx.restore();
}

var refreshAmt = 0; // slow down orientation update data
var orient = 0; // orientation placeholder if robot has this data
side_Display.prototype.side_Update = function ()
{
  var self = this;
  requestAnimationFrame(function(){self.side_Update();});

  ++refreshAmt;
  if (refreshAmt%100 == 0)
    orient += Math.random()*20 - Math.random()*20; // placeholder for robot orientation

  // draw robot at specified orientation and graphically show mining amt
  this.mining_rotate(orient);
}

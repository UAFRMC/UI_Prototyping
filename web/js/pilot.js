// Arsh Chauhan
// pilot.js: JS interface for driving the 2016 robot 

// robot: Must have a power object with left, right, mine, dump, roll 


function robot_pilot_t(div,robot,sim)
{
	if (!div)
		return null;
	this.div = div;

	if (!robot)
		this.power = {
			left:0,
			right:0,
			mine:0,
			dump:0,
			roll:0,
			powerLimit:0.3,
			highPowerLimit:0.7,
			highPower:false,
			mineLimit:0.3
		};
	else
		this.power = robot.power;
	if(sim)
		this.sim = sim;

	var _this = this;
	this.input_handler = new input_t(function(){_this.update_power()});
	//console.log(this.input_handler);
}

//FIX ME: Properly kill drive power when keys released
robot_pilot_t.prototype.update_power = function()
{
	console.log(this.power);
	console.log("KEY PRESSED");

	var powerDelta = 0.1;
	if (this.power.highPower)
		powerDelta = this.power.highPowerLimit;
	
	// Drive Keys
	// Disallow forward and reverses together
	// Allow turn and direction together
	if(this.input_handler.keys_down[keycode("W")])
		{
			this.power.left += powerDelta;
			this.power.right += powerDelta;
		}
	else if(this.input_handler.keys_down[keycode('S')])
		{
			this.power.left -= powerDelta;
			this.power.right -= powerDelta;
		}

	// Disallow both turns together 
	if(this.input_handler.keys_down[keycode('A')])
		{
			this.power.left -= powerDelta;
			this.power.right += powerDelta;
		}
	else if(this.input_handler.keys_down[keycode('D')])
		{
			this.power.left += powerDelta;
			this.power.right -= powerDelta;
		}	

	//Special Keys
	var mineDelta = this.power.mineLimit;

	//Mining head height
	if(this.input_handler.keys_down[kb_up])
		this.power.dump = 1;
	else if (this.input_handler.keys_down[kb_down])
		this.power.dump = -1;

	// Mining direction 
	if(this.input_handler.keys_down[kb_left])
		this.power.mine += mineDelta;
	else if(this.input_handler.keys_down[kb_right])
		this.power.mine -= mineDelta;

	// Dumping
	if(this.input_handler.keys_down[keycode('F')])
		this.power.roll = 1;
	else if(this.input_handler.keys_down[keycode('V')])
		this.power.roll = -1;


	//*****************Kill power whne key released******************//

	/*if(this.input_handler.keys_released[keycode("W")] && this.input_handler.keys_released[keycode('S')] && this.input_handler.keys_released[keycode('A')] && this.input_handler.keys_released[keycode('D')])
		{
			this.power.left = this.power.right = 0;
		}

	if(this.input_handler.keys_released[kb_up] || this.input_handler.keys_released[kb_down])
		this.power.dump = 0;

	if(this.input_handler.keys_released[kb_left] || this.input_handler.keys_released[kb_right])
		this.power.mine = 0;

	// Dumping
	if(this.input_handler.keys_released[keycode('F')] || this.input_handler.keys_released[keycode('V')])
		this.power.roll = 0;*/

	this.send_power();
}

robot_pilot_t.prototype.send_power = function()
{
	console.log('left: '+ this.power.left + 'right:'+ this.power.right + 'dump: '+ this.power.dump + 'mine: '+ this.power.mine + 'roll: '+ this.power.roll);
}


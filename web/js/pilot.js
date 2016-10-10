// Arsh Chauhan
// pilot.js: JS interface for driving the 2016 robot 

// robot: Must have a power object with left, right, mine, dump, roll 


function robot_pilot(div,robot,sim)
{
	if (!div)
		return null;
	this.div = div;

	if !(robot)
		this.power = {
			left:0,
			right:0,
			mine:0
			dump:0,
			roll:0,
			powerLimit:0.3,
			highPowerLimit:0.7,
			highPower=false,
			mineLimit:0.3
		};
	else
		this.power = robot.power;
	if(sim)
		this.sim = sim;

	this.input_handler = new input_t(update_power);
}

robot_pilot.protoype.update_power = function()
{

	if (this.highPower)
		var powerDelta = this.highPowerLimit;
	else
		var powerDelta = this.powerLimit;
	
	// Drive Keys
	// Disallow forward and reverses together
	// Allow turn and direction together
	if(this.input_handler.keys_down[keycode('w')])
		this.power.left = this.power.right += powerDelta;
	else if(this.input_handler.keys_down[keycode('s')])
		this.power.left = this.power.right -= powerDelta;

	// Disallow both turns together 
	if(this.input_handler.keys_down[keycode('a')])
		{
			this.power.left -= powerDelta;
			this.power.right += powerDelta;
		}
	else if(this.input_handler.keys_down[keycode('d')])
		{
			this.power.left += powerDelta;
			this.power.right -= powerDelta;
		}	

	//Special Keys
	var mineDelta = this.power.mineLimit;

	//Mining head height
	if(this.input_handler.keys_down[keycode(kb_up)])
		this.power.dump = 1;
	else if (this.input_handler.keys_down[keycode(kb_down)])
		this.power.dump = -1;

	// Mining direction 
	if(this.input_handler.keys_down[keycode(kb_left))
		this.power.mine += mineDelta;
	else if(this.input_handler.keys_down[keycode(kb_right))
		this.power.mine -= mineDelta;

	// Dumping
	

}
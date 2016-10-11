// Arsh Chauhan
// Based on code by Tristan Van Cise
// telemetry.js: Telemetry viewer for Aurora Robotics
// LCreated: 10/10/2016
// Last edited: 10/11/2016

function robot_telemetry_t(div,robot,sim)
{
    if (!div)
        return null;
    this.div = div;
    if (!robot)
       { 
            this.power =
            {
                left:0.0,
                right:0.0,
                mine:0.0,
                dump:0.0,
                roll:0.0,
            };
        }
        
    else
        this.power = robot.power;

    this.power.key = function(n) // Get the property value at this.power[n]
    {
        return this[Object.keys(this)[n]];
    }

    if(sim)
        this.sim.power = sim.power;
    this.create_telemetry_gui();

    var _this = this;
    this.update_interval = setInterval(function()
        {   
            _this.update_telemetry();
        },1000);

}

robot_telemetry_t.prototype.create_telemetry_gui = function()
{
    this.table = document.createElement('table');
    this.table.className= 'telemetry_table';
    this.heading_row = document.createElement('tr');
    this.heading_row.appendChild(document.createElement('td')).appendChild(document.createElement('th')).appendChild(document.createTextNode("Sensor"));
    this.heading_row.appendChild(document.createElement('td')).appendChild(document.createElement('th')).appendChild(document.createTextNode("Value"));    
    this.div.appendChild(this.table);
    this.table.appendChild(this.heading_row);
    
    for (prop in this.power)
    {
        var current_row = this.table.appendChild(document.createElement('tr'));
        if(prop != 'key') 
        {
            var prop_name = current_row.appendChild(document.createElement('td')).appendChild(document.createTextNode(prop));
            var prop_value = current_row.appendChild(document.createElement('td')).appendChild(document.createTextNode(""));
        }

    }
    var cells = document.getElementsByTagName('td');
    for (var i=0;i<cells.length;++i)
    {
        cells[i].className = 'telemetry_cell';
    }
}

robot_telemetry_t.prototype.update_telemetry = function()
{
    //FIX ME: Remove once real telemetry is available 
    this.power.left = Math.random()*30;
    this.power.right = Math.random()*60;
    this.power.mine = Math.random()*90;
    this.power.dump = Math.random();
    this.power.roll = Math.random();

    var rows = document.getElementsByTagName('tr');
    
    for (var i=1; i<rows.length-1;++i) //Skip heading row 
    {
        rows[i].children[1].childNodes[0].data=this.power.key(i-1).toFixed(2);
    }
}

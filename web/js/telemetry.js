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
            this.telemetry =
            {
                power:
                {
                    left:0.0,
                    right:0.0,
                    mine:0.0,
                    dump:0.0,
                    roll:0.0
                },
                location:
                {
                    x:0.0,
                    y:0.0,
                    angle:0.0
                }
            };
        }
        
    else
        this.telemetry = robot.telemetry;

    if(sim)
        this.telemetry = sim.telemetry;

    this.telem_rows = {};
    this.create_telemetry_gui();

    var _this = this;
    this.update_interval = setInterval(function()
        {   
            _this.update_telemetry();
        },1000);

}

//PRIVATE FUNCTION DO NOT CALL OUTSIDE OF CONSTRUCTOR
robot_telemetry_t.prototype.create_telemetry_gui = function()
{
    this.table = document.createElement('table');
    this.table.className= 'telemetry_table';
    
    this.heading_row = document.createElement('tr');
    this.heading_row.appendChild(document.createElement('td')).appendChild(document.createElement('th')).appendChild(document.createTextNode("Sensor"));
    this.heading_row.appendChild(document.createElement('td')).appendChild(document.createElement('th')).appendChild(document.createTextNode("Value"));    
    
    this.div.appendChild(this.table);
    this.table.appendChild(this.heading_row);

    for (var prop in this.telemetry)
    {
        this.telem_rows[prop] = {};

        for (var sensor in this.telemetry[prop])
        {
            var row = this.table.appendChild(document.createElement('tr'));
            var col_name = row.appendChild(document.createElement('td')).appendChild(document.createTextNode(sensor));
            var textnode=document.createTextNode("");
            var col_value = row.appendChild(document.createElement('td')).appendChild(textnode);
            this.telem_rows[prop][sensor] = textnode;
        }

    }
    var cells = document.getElementsByTagName('td');
    for (var i=0;i<cells.length;++i) //Add class to all cells on page
    {
        cells[i].className = 'telemetry_cell';
    }
}

robot_telemetry_t.prototype.update_telemetry = function()
{
    //FIX ME: Remove once real telemetry is available 
    //Random sensor telemetry 
    this.telemetry.power.left = (Math.random()*30).toFixed(2);
    this.telemetry.power.right = (Math.random()*60).toFixed(2);
    this.telemetry.power.mine = (Math.random()*90).toFixed(2);
    this.telemetry.power.dump = (Math.random()).toFixed(2);
    this.telemetry.power.roll = (Math.random()).toFixed(2);
    
    //Random location telemetry
    this.telemetry.location.x = (Math.random()*(194-(-194))-194).toFixed(2);
    this.telemetry.location.y = (Math.random()*738).toFixed(2);
    this.telemetry.location.angle = (Math.random()*(180-(-180))-180).toFixed(2)

    for (var prop in this.telemetry)
    {
        for (var sensor in this.telemetry[prop])
        {
            this.telem_rows[prop][sensor].nodeValue = this.telemetry[prop][sensor];
        }

    }
}

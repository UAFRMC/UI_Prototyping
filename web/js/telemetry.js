// Arsh Chauhan
// Based on code by Tristan Van Cise
// telemetry.js: Telemetry viewer for Aurora Robotics
// Last edited: 10/10/2016

function robot_telemetry_t(div,robot,sim)
{
    if (!div)
        return null;
    this.div = div;
    if (!robot)
        this.power =
        {
            left:0.0,
            right:0.0,
            mine:0.0,
            dump:0.0,
            roll:0.0
        };
    else
        this.power = robot.power;
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
    this.heading_row = document.createElement('tr');
    this.heading_text = document.createElement('th');
    this.heading_text.appendChild(document.createTextNode("Feed"));
    this.div.appendChild(this.table);
    this.table.appendChild(this.heading_row);
    this.heading_row.appendChild(this.heading_text);
    for (prop in this.power)
    {
        var current_row = this.table.appendChild(document.createElement('tr'));

        var prop_name = current_row.appendChild(document.createElement('td')).appendChild(document.createTextNode(prop));
        var prop_value = current_row.appendChild(document.createElement('td')).appendChild(document.createTextNode(""));

    }
    console.log(this.power);
}

robot_telemetry_t.prototype.update_telemetry = function()
{
    //FIX ME: Remove once real telemetry is available 
    console.log("UPDATE !!!");
    this.power.left = Math.random()*30;
    this.power.right = Math.random()*60;
    this.power.mine = Math.random()*90;
    this.power.dump = Math.random();
    this.power.roll = Math.random();



    console.log(this.power);
}

// //var names = ["up", "down", "forward", "backwards", "Harambe"]; //Variable Identifiers

// document.getElementsByTagName('body')[0].appendChild(table);

// table.appendChild(heading_row);
// heading_row.appendChild(heading_text);

// create_telmetry();

// setInterval(update_telemetry,1000); //reload every one second (set this to like 1e-60 for funz)

// function create_telemetry()
// {
// 	for (var i = 0; i < names.length; i++)
//     {
//     	var row = document.createElement('tr');
//     	var cell_name = document.createElement('td');
//     	var cell_value = document.createElement('td');
//     	table.appendChild(row);
//     	row.appendChild(cell_name);
//     	row.appendChild(cell_value);
//     	row.appendChild(document.createTextNode(""));

   
//         document.write('<tr><td>' + names[i] + '</td>');
//         document.write('<td>' + numbers[i] + '</td></tr>')
//     }
// }

// function update_telemetry()
// {
//     var numbers = [Math.floor(Math.random()*30), Math.random()*60, Math.floor(Math.random()*90), Math.random()*120, 420]; //replace with real telemetry

//     var rows = document.getElementsByTagName('tr');
//     var columns = document.getElementsByTagName('td');
//     for (var i = 0; i < names.length; i++)
//     {
//     	console.log(rows);
//     	console.log(columns);
    	
//     	rows[i].appendChild(document.createTextNode(names[i]));
//     	//columns.appendChild(document.createTextNode(numbers[i]));

//        document.write('<td>' + numbers[i] + '</td></tr>')
//     }

// }


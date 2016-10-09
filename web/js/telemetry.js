var names = ["up", "down", "forward", "backwards", "Harambe"]; //Variable Identifiers

document.write('<table>');
document.write('<tr><th>Feed</th></tr>');


var timeout = setTimeout("location.reload(true);",1000); //reload every one second (set this to like 1e-60 for funz)

while(true)
{
    timeout; //refresh
    var numbers = [Math.floor(Math.random()*30), Math.random()*60, Math.floor(Math.random()*90), Math.random()*120, 420]; //replace with real telemetry

    for (var i = 0; i < names.length; i++)
    {
        document.write('<tr><td>' + names[i] + '</td>');
        document.write('<td>' + numbers[i] + '</td></tr>')
    }

    sleep(0.1);
}

document.write('</table>');


/**
 * Don't change the code below
 */
var environment;
var agentPath;
var s = [];
function readFile() {
    var string;
   // var file = document.getElementById("fileUpload").files[0];
    var file = $('#fileUpload').get(0).files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            string = evt.target.result;
            //alert(string);
            environment = processFile(string);
            //read environment change it to matrix
           // readEnvironment(environment);  // works fine
        }
        reader.onerror = function (evt) {
            alert("error reading file");
        }
    } else return;
}


//works fine
//get the information of environment
function processFile(string) {
    var lines = string.split('\n');
    var size = Size(lines[0].match(/\d+/g, '')[0], lines[0].match(/\d+/g, '')[1]);
    //environment size is correct
    var agents = [];
    var regions = [];
    var environment = {};
    var currentRegionID;

    var i = 1;
    while (i < lines.length) {
        var openSpacesOfOneRegion = [];
        if (lines[i].includes('Region')) {
            currentRegionID = lines[i].match(/\d+/g, '')[0];
            i++;
        }
        if (lines[i].includes('Coordinates:')) {
            var coordinates = lines[i].match(/\d+/g, '');
            for (var j = 0; j < coordinates.length; j = j + 2) {
                var posi = Position(coordinates[j], coordinates[j + 1]);
                openSpacesOfOneRegion.push(posi);
            }
            var region = Region(currentRegionID, openSpacesOfOneRegion);
            regions.push(region);
            i++;
        }
        if (lines[i].includes('Agents')) {
            i++;
        }
        if (lines[i].includes('Agent')) {
            var agentId = lines[i].match(/\d+/g, '')[0];
            var agentPosition = Position(lines[i].match(/\d+/g, '')[1], lines[i].match(/\d+/g, '')[2]);
            agents.push(Agent(agentId, agentPosition, currentRegionID));
            i++;
        }
    }
    environment.size = size;
    environment.regions = regions;
    environment.agents = agents;
    return environment;
}

function Position(x, y) {
    var position = {};
    position.x = x;
    position.y = y;
    return position;
}

function Size(x, y) {
    var size = {};
    size.x = x;
    size.y = y;
    return size;
}

function Agent(id, position, region) {
    var agent = {};
    agent.id = id;
    agent.position = position;
    agent.region = region;
    return agent;
}

function Region(id, openSpaces) {
    var region = {};
    region.id = id;
    region.openSpaces = openSpaces;
    return region;
}
/**
 * read environment get the environment 0,1 matrix
 */

function getSettings() {
    $.ajax({
        url: "/file",
        method: "GET",
        data: { environment: environment},
        success:showAgentsPath,
        error: function (data) {
            alert("error");
        }
    });
}

//Don't change the code above

function getEnvironment(){
    return environment;
}

function getAgentPath(){
    return  agentPath;
}
//allAgentsPaths below is the data you need to display
function showAgentsPath(allAgentsPaths) {
    paper = Raphael("holderOfBlock",1280,680);
    drawEnvironment(getEnvironment());
    showGuidelines(getEnvironment());
    agentPath=allAgentsPaths;


    saveRunInfo();  //save information

}


function getRunInfo() {
    $.ajax({
        url: "/history",
        method: "GET",
        data: { date: "2017-03-25"},
        success:showDate,
    });
}

function showDate(data){
console.log(JSON.stringify(data));
}

function saveRunInfo() {
    var date=new Date();
    var timestamp=Math.round(date.getTime());

    // var size=JSON.stringify(environment.size.x)+"X"+JSON.stringify(environment.size.y);
    var size=environment.size.x+"X"+environment.size.y;

    var coordinate=JSON.stringify(environment.regions);

    var targetlist="";

     var agentpath=JSON.stringify(JSON.stringify(agentPath));

     var step=11;

    $.ajax({
        url: "/saveRun",
        method: "POST",
        data: {
            date:timestamp,
            size:size,
            coordinate:coordinate,
            targetlist: targetlist,
            agentpath: agentpath,
            step:step
        },
        success:showDate,
    });
}


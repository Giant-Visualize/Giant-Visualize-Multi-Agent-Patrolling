/**
 * Don't change the code below
 */
var environment;
var agentPath;
var targetList;
var currentTarget=[];
var s = [];

function readFile() {
    var string;
    // var file = document.getElementById("fileUpload").files[0];
    var file = $('#fileUpload').get(0).files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function(evt) {
            string = evt.target.result;
            //alert(string);
            environment = processFile(string);
            //read environment change it to matrix
            // readEnvironment(environment);  // works fine
        }
        reader.onerror = function(evt) {
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
        } else {
            i++;
        }
    }
    environment.size = size;
    environment.regions = regions;
    environment.agents = agents;
    if (!verifyFile(environment)) {
        return null;
    }
    return environment;
}

function verifyFile(env) {
    var agents = env.agents;
    var regions = env.regions;
    var size = env.size;
    //region position is invalid, like the index is less or more than size
    for (var i = 0; i < regions.length; i++) {
        var currentRegion = regions[i];
        for (var m = 0; m < currentRegion.openSpaces.length; m++) {
            if (currentRegion.openSpaces[m].x - 0 < 1 || currentRegion.openSpaces[m].x - 0 > size.x - 0 || currentRegion.openSpaces[m].y - 0 < 1 || currentRegion.openSpaces[m].y - 0 > size.y - 0) {
                alert('Invalid region');
                return false;
            }
        }
    }
    //agents information is correct or not
    for (var j = 0; j < agents.length; j++) {
        var agentRegion = agents[j].region;
        //agent start position is invalid, like the index is less or more than size
        if (agents[j].position.x - 0 < 1 || agents[j].position.x - 0 > size.x - 0 || agents[j].position.y - 0 < 1 || agents[j].position.y - 0 > size.y - 0) {
            alert('Invalid agent position');
            return false;
        }

        //agent start position is not in the region
        for (var k = 0; k < regions.length; k++) { //find the region that the agent belongs to
            if (regions[k].id === agentRegion) {
                var n = 0;
                for (n = 0; n < regions[k].openSpaces.length; n++) { //check whether the agent is in that region
                    if ((regions[k].openSpaces[n].x - 0 === agents[j].position.x - 0) && regions[k].openSpaces[n].y - 0 === agents[j].position.y - 0) {
                        break;
                    }
                }
                if (n === regions[k].openSpaces.length) {
                    alert("Agent position is not in the region");
                    return false;
                }
            }
        }
    }
    //one region has two same position
    return true;
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
    if (environment === null)
        return;
    $.ajax({
        url: "/file",
        method: "GET",
        data: { environment: environment,
        algo : getAlgorithmsType()
    },
        success: showAgentsPath,
        error: function(data) {
            alert("error");
        }
    });
}

//Don't change the code above

function getEnvironment() {
    return environment;
}

function getAgentPath() {
    return agentPath;
}

function getTargetList(){
    return targetList;
}

function getCurrentTarget(){
    return currentTarget;
}


//allAgentsPaths below is the data you need to display
function showAgentsPath(allAgentsPaths) {
    agentPath=allAgentsPaths[0];
    targetList=allAgentsPaths[1];

    agentPath.forEach((ap)=>{
        for(var i=0;i<ap.path.length;i++){
            for(j=0;j<ap.targets.length;j++){
                if(ap.path[i][0]==ap.targets[j][0]&&ap.path[i][1]==ap.targets[j][1]){
                   currentTarget.push({id:ap.id,index:i,x:ap.path[i][0],y:ap.path[i][1]}); 
                }
            }
            if(i==ap.path.length-1){
               currentTarget.push({id:ap.id,index:i,x:ap.path[i][0],y:ap.path[i][1]});  
            }
        }
    });


    // agentPath.forEach((ap)=>{
    //     for(var i=0;i<ap.path.length-1;i++){
    //         if(ap.path[i][0]==ap.path[i+1][0]&&ap.path[i][1]==ap.path[i+1][1]){
    //             currentTarget.push({id:ap.id,index:i,x:ap.path[i][0],y:ap.path[i][1]});
    //             ap.path.splice(i+1,1);
    //             i--;
    //         }
    //         if(i==ap.path.length-2){
    //             currentTarget.push({id:ap.id,index:i+1,x:ap.path[i+1][0],y:ap.path[i+1][1]});
    //         }
    //     }
    // });

    paper = Raphael("holderOfBlock", 1280, 680);
    drawEnvironment(getEnvironment(),agentPath);
    showGuidelines(getEnvironment());
    
}
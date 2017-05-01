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
    var file = $('#fileUpload').get(0).files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function(evt) {
            string = evt.target.result;
            environment = processFile(string);
            var type = getAlgorithmsType();
            if(! verifyFile(environment)){
		environment = null;
	    }
            if(type === "constrained-3"){
                validationConstrained3(environment);
            }else if(type === "constrained-4"){
                validationConstrained4(environment);
            }
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
        if (lines[i].includes('Coordinates')) {
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
            agents.push(new Agent(agentId, agentPosition, currentRegionID));
            i++;
        } else {
            i++;
        }
    }
    environment.size = size;
    environment.regions = regions;
    environment.agents = agents;
    console.log("front end");
    for(var a=0;a<environment.regions.length;a++){
	console.log(environment.regions[a].openSpaces);
    }
    
    return environment;
}

function verifyFile(env) {
      return verifySize(env) && verifyRegionPosition(env)
        && duplicatedRegionId(env) && duplicatedAgentId(env)
        && duplicateCoordinateInRegion(env) && regionNotContinue(env)
        && agentsNumberConstrain(env) && verifyAgent(env);
}

/************File validation*******************/
function verifySize(env) {
    var size = env.size;
    if (size.x > 16 || size.x < 8 || size.y > 16 || size.y < 8) {
        alert(fileErrorObj.error.size);
        return false;
    }
    return true;
}

function verifyRegionPosition(env) {
    var regions = env.regions;
    var agents = env.agents;
    var size = env.size;
    for (var i = 0; i < regions.length; i++) {
        var currentRegion = regions[i];
        for (var m = 0; m < currentRegion.openSpaces.length; m++) {
            if (currentRegion.openSpaces[m].x - 0 < 1 || currentRegion.openSpaces[m].x - 0 > size.x - 0 || currentRegion.openSpaces[m].y - 0 < 1 || currentRegion.openSpaces[m].y - 0 > size.y - 0) {
		var p = m+1;
                alert("Region "+ regions[i].id +" "+p+"th"+" coordinate is invalid.");
                return false;
            }
        }
    }
    return true;
}

function verifyAgent(env) {
    var agents = env.agents;
    var regions = env.regions;
    var size = env.size;    

    for (var j = 0; j < agents.length; j++) {
        var agentRegion = agents[j].region;
        //agent start position is invalid, like the index is less or more than size
        if (agents[j].position.x - 0 < 1 || agents[j].position.x - 0 > size.x - 0 || agents[j].position.y - 0 < 1 || agents[j].position.y - 0 > size.y - 0) {
            alert("The coordinate of Agent "+ agents[j].id +" is invalid.");
            return false;
        }

        //agent start position is not in the region
        for (var k = 0; k < regions.length; k++) {//find the region that the agent belongs to
            if (regions[k].id === agentRegion) {
                var n = 0;
                for (n = 0; n < regions[k].openSpaces.length; n++) {//check whether the agent is in that region
                    if ((regions[k].openSpaces[n].x - 0 === agents[j].position.x - 0) && regions[k].openSpaces[n].y - 0 === agents[j].position.y - 0) {
                        break;
                    }
                }
                if (n === regions[k].openSpaces.length) {
                    alert("Agent " + agents[j].id +" is not in region "+regions[k].id);
                    return false;
                }
            }
        }
    }
    //one region has two same position
    return true;
}

function agentsNumberConstrain(env) {
    var agents = env.agents;
    var regions = env.regions;

    for (var i= 0; i < regions.length;i++){
        var regionId = regions[i].id;
        var count = 0;
        for (var j = 0; j < agents.length; j++) {
            if (agents[j].region === regionId) {
                count++;
            }
        }
        if (count === 0) {
            alert("Region "+i+ " should have at least one agent.");
            return false;
        }
        if (count > regions[i].openSpaces.length / 2) {
            alert("The number of agents in region "+ regions[i].id +" is more then the half of the open spaces in this region.");
            return false;
        }
    }
    return true;
}

function duplicatedAgentId(env) {
    var agents = env.agents;
    var ids = [];
    for (var i = 0; i < agents.length; i++){
        if (ids.includes(agents[i].id)) {
            alert("Agent id "+ agents[i].id + "is duplicated");
            return false;
        } else {
            ids.push(agents[i].id);
        }
    }
    return true;
}

function duplicatedRegionId(env) {
    var regions = env.regions;
    var ids = [];
    for (var i = 0; i < regions.length; i++) {
        if (ids.includes(regions[i].id)) {
            alert("The region id "+ regions[i].id + " is duplicated.");
            return false;
        } else {
            ids.push(regions[i].id);
        }
    }
    return true;
}

function duplicateCoordinateInRegion(env) {
    var regions = env.regions;
    for (var i = 0; i < regions.length; i++) {
        var coordinatesInRegion = [];
        for (var j = 0; j < regions[i].openSpaces.length; j++) {
            if (coordinatesInRegion.includes(regions[i].openSpaces[j].x + " " + regions[i].openSpaces[j].y)) {
                alert("Duplicate coordinate ("+regions[i].openSpaces[j].x + ","+ regions[i].openSpaces[j].y+") in region "+ regions[i].id);
                return false;
            } else {
                coordinatesInRegion.push(regions[i].openSpaces[j].x + " " + regions[i].openSpaces[j].y);
            }    
        }
    }
    return true;
}

function regionNotContinue(env) {
    var regions = env.regions;

    for (var i = 0; i < regions.length; i++) {
        var openSpaces = [];
        for (var j = 0; j < regions[i].openSpaces.length; j++) {
            openSpaces.push(regions[i].openSpaces[j].x + " " + regions[i].openSpaces[j].y);
        }
        for (var k = 0; k < regions[i].openSpaces.length; k++) {
            var x = Number(regions[i].openSpaces[k].x);
            var y = Number(regions[i].openSpaces[k].y);
            var left = x - 1 ;
            var right = x + 1;
            var up = y - 1;
            var down = y + 1;
            if (!(openSpaces.includes(left+" "+ y) || openSpaces.includes(right+ " "+ y) || openSpaces.includes(x+" "+up)
                || openSpaces.includes(x+" "+down))) {
                alert("Region "+ regions[i].id +" coordinate ("+x+","+y+")" +" is not continued");
                return false;
            }
        }
    }
    return true;
}

/**************file validation for constrained-3*******************/
function validationConstrained3(env) {
    var agents = env.agents;
    var regions = env.regions;

    for (var i = 0; i < regions.length; i++) {
        var regionId = regions[i].id;
        var count = 0;
        for (var j = 0; j < agents.length; j++) {
            if (agents[j].region === regionId) {
                count++;
            }
        }
        if (count > regions[i].openSpaces.length / 3) {
            alert("The number of agent in region  "+ regions[i].id + " is more than [n/3]");
            return false;
        }
    }
    return true;
}
/***************end fild validation for constrained-3**************/
/***************C4 file validation */
function validationConstrained4(env) {
    var agents = env.agents;
    var regions = env.regions;

    for (var i = 0; i < regions.length; i++) {
        var regionId = regions[i].id;
        var count = 0;
        for (var j = 0; j < agents.length; j++) {
            if (agents[j].region === regionId) {
                count++;
            }
        }
        if (count > regions[i].openSpaces.length / 4) {
            alert("The number of agent in regin "+(i+1)+" is more than [n/4]");
            return false;
        }
    }

    for (var i = 0 ; i < regions.length; i++){
        for (var j = 0 ; j < agents.length; j++){
            checkStartPosition(agents[j],regions[i])
        }
    }
    
    return true;
}

function checkIncludes(obj,region){
    for(var i = 0 ; i < region.openSpaces.length;i++){
        if((obj.x == region.openSpaces[i].x) && (obj.y == region.openSpaces[i].y)){
            return true;
        }
    }
    return false;
}

function checkStartPosition (agent,region){
    var count = 0;
    if(!checkRec(region)){
    if (checkIncludes({x:parseInt(agent.position.x)-1,y:agent.position.y},region)){
        count++;
    }
    if (checkIncludes({x:parseInt(agent.position.x)+1,y:agent.position.y},region)){
        count++;
    }
    if (checkIncludes({x:agent.position.x,y:(parseInt(agent.position.y)+1)},region)){
        count++;
    }
    if (checkIncludes({x:agent.position.x,y:(parseInt(agent.position.y)-1)},region)){
        count++;
    }
    if (count > 1){
        alert("Agent "+ agent.id+" start position error");
    }
    } else{
        console.log("is Rec");
    }
}

function checkRec(region){
    console.log("check Rec");
    var matchedSpace = 0;
    for(var i = 0; i< region.openSpaces.length; i++ ){
        var count = 0;
        if (checkIncludes({x:parseInt(region.openSpaces[i].x)+1,y:region.openSpaces[i].y},region)){
            count++;
        }
        if (checkIncludes({x:parseInt(region.openSpaces[i].x-1),y:region.openSpaces[i].y},region)){
            count++;
        }
        if (checkIncludes({x:region.openSpaces[i].x,y:parseInt(region.openSpaces[i].y)-1},region)){
            count++;
        }
        if (checkIncludes({x:region.openSpaces[i].x,y:parseInt(region.openSpaces[i].y)+1},region)){
            count++;
        }
        if (count > 1){
            matchedSpace++;
        }
    }
    console.log(matchedSpace +" and "+region.openSpaces.length);
    if (matchedSpace == region.openSpaces.length){
        console.log("Rec");
        return true;
    } else {
         console.log("NotRec");
        return false;
    }
}
/***************C4 end */

/************End File Validation***************/

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
    /*
    var agent = {};
    agent.id = id;
    agent.position = position;
    agent.region = region;
    return agent;*/
    this.id = id;
    this.position = position;
    this.region = region;
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
		regions:environment.regions,
		algo : getAlgorithmsType()
    },
        success: showAgentsPath,
        error: function(data) {
            alert(" Please refresh page and upload a correct file.");
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

    paper = Raphael("holderOfBlock", 1280, 1280);
    drawEnvironment(getEnvironment(),agentPath);
    showGuidelines(getEnvironment());
    
}

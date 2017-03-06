var express = require('express');
var fs = require('fs');
var http = require("http");
var router = express.Router();
var PF = require('pathfinding');

/*
 *Don't change the code below 
 */
var targetList = []; 
var envMatrix;
var environment;
//get the target and get the path to the target
//set agent pisotion to the target
//push the result to agentsInfoStore
//agentsInfoStore: id, region, path
function chooseTargetsAndGetPaths(agentsInfo) {
    var agentsInfoStore = [];
    while (targetList.length > 0) {
        for (var i = 0; i < agentsInfo.length; i++) {
            var target = chooseTarget(agentsInfo[i]);
            if (target) {
                agentsInfoStore.push(AgentPathInfo(agentsInfo[i].id, agentsInfo[i].region, shortestPath(agentsInfo[i].position, target)));
                agentsInfo[i].position = target;
            }
        }//end for
    }//end while
    processAgentsMoveInfo(agentsInfoStore);
    return agentsInfoStore;
}
//process agentsInfoStore, make the path contionous
function processAgentsMoveInfo(agentsInfoStore) {
    //get rid of the initial position
    for (var i = 0; i < agentsInfoStore.length; i++) {
        agentsInfoStore[i].path.shift();
    }
    //add all the path togther
    for (var j = 0; j < agentsInfoStore.length-1; j++) {
        for (var k = j+1; k < agentsInfoStore.length; k++) {
            if (agentsInfoStore[k].id === agentsInfoStore[j].id) {
                while (agentsInfoStore[k].path.length>0) {
                    agentsInfoStore[j].path.push(agentsInfoStore[k].path.shift());
                }
            }
        }
    }
    //get rid of the object with enmpt path
    for (var m = agentsInfoStore.length-1; m > 0; m--) {
        if (agentsInfoStore[m].path.length === 0) {
            agentsInfoStore.pop();
        }
    }
}
//write the run information to file 
//including; region id, region coordinates, target list for this region, agents' paths
function writeRunInfoToFile(agentsInfoStore) {
    var runStatistics = [];
    var envRegions = environment.regions;
    var numOfOpenSpaces = 0;
    for (var i = 0; i < envRegions.length; i++) {
        var agentsInTheRegion = [];
        //the saved agents' position is based on (0,0), not Kasi(1,1)
        for (var j = 0; j < agentsInfoStore.length; j++) {
            if (agentsInfoStore[j].region === envRegions[i].id) {
                agentsInTheRegion.push(agentsInfoStore[j]);
            }
        }
        runStatistics.push(RegionInfoToSave(envRegions[i].id, envRegions[i].openSpaces, envRegions[i].openSpaces, agentsInTheRegion));
        numOfOpenSpaces = numOfOpenSpaces + envRegions[i].openSpaces.length;
    }
    var steps = 0;
    for (var j = 0; j < agentsInfoStore.length; j++) {
        steps = steps + agentsInfoStore[j].path.length + 1;
    }

    var fileName = environment.size.x + 'x' + environment.size.y + '-#R' + envRegions.length + '-#A' + environment.agents.length + '-#OS' + numOfOpenSpaces + '#DATE'+Date.now();
    var content = JSON.stringify(runStatistics);
    fs.writeFile(fileName, content, (err) => {
            if (err) throw err;
    });
    
}

function RegionInfoToSave(id, coordinates, targetList, agents) {
    var regionInfoToSave = {};
    regionInfoToSave.id = id;
    regionInfoToSave.coordinates = coordinates;
    regionInfoToSave.targetList = targetList;
    regionInfoToSave.agents = agents;
    return regionInfoToSave;
};

function AgentPathInfo(id, region, path) {
    var agent = {};
    agent.id = id;
    agent.region = region;
    agent.path = path;
    return agent;
}
//find a target for an agent.
//The rule to choose target is that choose the every posotoin in the targetList
function chooseTarget(agent) {
    var target;
    for (var i = 0; i < targetList.length; i++) {
        if (targetList[i].regionId === agent.region) {
            target = targetList[i].position;
            targetList.splice(i, 1);
            break;
        }
    }
    return target;
}
//find the shortest path between startPosi and endPosi
function shortestPath(startPosi, endPosi) {
    var grid = new PF.Grid(envMatrix);
    var finder = new PF.AStarFinder({
        allowDiagonal: false
    });
    //var path = finder.findPath(1, 2, 4, 2, grid);
    var path = finder.findPath(startPosi.x-1, startPosi.y-1, endPosi.x-1, endPosi.y-1, grid);
    return path;
}

//get the 0,1 environment matrix for display purpose and for finding the shortest path
//the code readEnvironment can be reused
function readEnvironment(environment) {
    envMatrix = [];
    var sizeX = environment.size.x;
    var sizeY = environment.size.y;
    for (var i = 0; i < sizeY; i++) {
        envMatrix[i] = [];
        for (var j = 0; j < sizeX; j++) {
            envMatrix[i][j] = 1;
        }
    }
    for (var m = 0; m < environment.regions.length; m++) {
        for (var n = 0; n < environment.regions[m].openSpaces.length; n++) {
            var openspaceX = environment.regions[m].openSpaces[n].y - 1;
            var openspaceY = environment.regions[m].openSpaces[n].x - 1;
            envMatrix[openspaceX][openspaceY] = 0;
        }
    }
}
//get the agent information
function getAgentsInfo(environment) {
    var agentsInfo = [];
    for (var i = 0; i < environment.agents.length; i++) {
        agentsInfo.push(environment.agents[i]);
    }
    return agentsInfo;
}

//create a target
function Target(regionId, position) {
    var target = {};
    target.regionId = regionId;
    target.position = position;
    return target;
}

//get target List
function getTargetList() {
    var agentsPosition = [];
    for (var i = 0; i < environment.agents.length; i++) {
        var agentPosi = environment.agents[i].position;
        var str = '[' + agentPosi.x + ',' + agentPosi.y + ']';
        agentsPosition.push(str);
    }
    for (var m = 0; m < environment.regions.length; m++) {
        for (var n = 0; n < environment.regions[m].openSpaces.length; n++) {
            var posi = environment.regions[m].openSpaces[n];
            var posiStr = '[' + posi.x + ',' + posi.y + ']';
            if (!agentsPosition.includes(posiStr)) {//!agentsPosition.includes(posi)
                targetList.push(Target(environment.regions[m].id, posi));
            }
        }
    }
}

function Node(x, y) {
    var node = {};
    node.x = x;
    node.y = y;
    return node;
}

function getAgentPath(environment){
    readEnvironment(environment);
    getTargetList();
    var agentsInfo = getAgentsInfo(environment);
    var agentsInfoStore = chooseTargetsAndGetPaths(agentsInfo);//return to client
    return agentsInfoStore;
}


//Don't change the code above
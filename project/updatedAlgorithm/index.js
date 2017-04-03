var express = require('express');
var fs = require('fs');
var http = require("http");
var router = express.Router();
var PF = require('pathfinding');

/*
 *Don't change the code below 
 */ 
var envMatrix;
var environment;

//get the target and get the path to the target
//set agent pisotion to the target
//push the result to agentsInfoStore
//agentsInfoStore: id, region, path
function chooseTargetsAndGetPaths(agentsInfo, targetList) {
    var agentsInfoStore = [];
    var visitedPath = [];
    var targetListArray = [];
    for (var i = 0; i < agentsInfo.length; i++) {
        var target = chooseTarget(agentsInfo[i], targetList);
        var array = [];
        visitedPath.push(new visitedPathConstrator(agentsInfo[i].id, agentsInfo[i].region, array));
        if (target) {
            agentsInfoStore.push(AgentPathInfo(agentsInfo[i].id, agentsInfo[i].region, shortestPath(agentsInfo[i].position, target)));
            agentsInfo[i].position = target;
        }
    }//end for
    while (!agentInfoPathIsEmpty(agentsInfoStore)) {
        targetListArray.push(new copyTargetList(targetList));
        for (var j = 0; j < agentsInfoStore.length; j++) {
            if (agentsInfoStore[j].path.length > 0) {
                var currentNode = agentsInfoStore[j].path.shift();
                visitedPath[j].path.push(currentNode);
                targetList = deleteNodeFromTargetList(currentNode, targetList);
            } else {
                var tempTarget = chooseTarget(agentsInfo[j], targetList);
                if (tempTarget) {//find a target
                    agentsInfoStore[j].path = shortestPath(agentsInfo[j].position, tempTarget);
                    agentsInfo[j].position = tempTarget;
                } else {//target is null
                    agentsInfoStore[j].path = [];
                }
            }
        }
    }
    console.log(JSON.stringify(visitedPath));
    console.log((targetListArray));
    return visitedPath;
}

function AgentPathInfo(id, region, path) {
    var agent = {};
    agent.id = id;
    agent.region = region;
    agent.path = path;
    return agent;
}
//find a target for an agent.
//The rule to choose target is that choose the every posotoin in the targetList
function chooseTarget(agent, targetList) {
    var target;
    for (var i = 0; i < targetList.length; i++) {
        if (targetList[i].regionId === agent.region) {
            target = targetList[i].position;
          //  targetList.splice(i, 1);
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
    var targetList = [];
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
    return targetList;
}

function Node(x, y) {
    var node = {};
    node.x = x;
    node.y = y;
    return node;
}

function AgentInfo(id, position, region) {
    this.id = id;
    this.position = position;
    this.region = region;
}
function copyAgentsInfo(agentsInfo) {
    var copyAgentsInfoArray = [];
    for (var i = 0; i < agentsInfo.length; i++) {
        copyAgentsInfoArray.push(new AgentInfo(agentsInfo[i].id, agentsInfo[i].position, agentsInfo[i].region));
    }
    return copyAgentsInfoArray;
}

/**
**********************Add for changed environment*******************
 */

//algorithm constrain-3
function visitedPathConstrator(agentId, agentRegion, path) {
    this.agentId = agentId;
    this.agentRegion = agentRegion;
    this.path = path;
}

function copyTargetList(targetList) {
    var copy = [];
    for (var i = 0; i < targetList.length; i++) {
        copy.push(Target(targetList[i].regionId, targetList[i].position));
    }
    return copy;
}

function chooseTargetConstrain3(agent, targetList) {
    var target = null, pathLength = 0;
    //find the farest targrt
    for (var j = 0; j < targetList.length; j++) {
        if (targetList[j].regionId === agent.region) {
            var distance = shortestPath(agent.position, targetList[j].position).length;
            if (pathLength < distance) {
                target = targetList[j].position;
                pathLength = distance;
            }
        }
    }
    return target;
}

function constrain3GetPath(agentsInfo, targetList) {
    var agentsInfoStore = [];
    var visitedPath = [];
    var targetListArray = [];
    for (var i = 0; i < agentsInfo.length; i++) {
        var target = chooseTargetConstrain3(agentsInfo[i], targetList);
        var array = [];
        visitedPath.push(new visitedPathConstrator(agentsInfo[i].id, agentsInfo[i].region, array));
        if (target) {
            agentsInfoStore.push(AgentPathInfo(agentsInfo[i].id, agentsInfo[i].region, shortestPath(agentsInfo[i].position, target)));
            agentsInfo[i].position = target;
        }
    }//end for
    while (!agentInfoPathIsEmpty(agentsInfoStore)) {
        targetListArray.push(new copyTargetList(targetList));
        for (var j = 0; j < agentsInfoStore.length; j++) {
            if (agentsInfoStore[j].path.length > 0) {
                var currentNode = agentsInfoStore[j].path.shift();
                visitedPath[j].path.push(currentNode);
                targetList = deleteNodeFromTargetList(currentNode, targetList);
            } else {
                var tempTarget = chooseTargetConstrain3(agentsInfo[j], targetList);
                if (tempTarget) {//find a target
                    agentsInfoStore[j].path = shortestPath(agentsInfo[j].position, tempTarget);
                    agentsInfo[j].position = tempTarget;
                } else {//target is null
                    agentsInfoStore[j].path = [];
                }
            }
        }
    }
    console.log(JSON.stringify(visitedPath));
    console.log((targetListArray));
    return visitedPath;
}

function deleteNodeFromTargetList(node, targetList) {
    for (var i = 0; i < targetList.length; i++) {
        if (targetList[i].position.x-0 === node[0]+1 && targetList[i].position.y-0 === node[1]+1) {
            targetList.splice(i,1);
        }
    }
    return targetList;
}

function agentInfoPathIsEmpty(agentsInfoStore) {
    for (var i = 0; i < agentsInfoStore.length; i++){
        if (agentsInfoStore[i].path.length !== 0) {
            return false;
        }
    }
    return true;
}

/********************************************************************/

router.get('/', function (req, res, next) {
    res.sendFile('index.html', { root: __dirname + "/../public" });
});

router.get('/file', function (req, res, next) {
    environment = req.query.environment;
    readEnvironment(environment);
    var targetList = getTargetList();
    var agentsInfo = getAgentsInfo(environment);
    var copyAgentInfo = copyAgentsInfo(agentsInfo);
    var visitedPath = chooseTargetsAndGetPaths(copyAgentInfo, targetList);//return to client
    //test constrain 3
    var agentsInfo1 = getAgentsInfo(environment);
    var targetList1 = getTargetList();
    var agentsInfoConstrain3 = constrain3GetPath(agentsInfo1, targetList1);
    res.status(200).send(visitedPath);
});
module.exports = router;
//Don't change the code above
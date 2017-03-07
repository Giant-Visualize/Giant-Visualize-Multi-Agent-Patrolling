var temporaryRegion = [];
var regionCount = 0;
var wholeRegion = [];
var rawEnvironment = {};
var environmentOfAll = [];
var agentArray = [];
var agentCount = 0;
var currentStep = 0;
var currentAgent = [];
var paper = {};
var firstCreateGraph=true;
var wholePath = [];

function init() {
    paper = Raphael("holderOfBlock",1280,1280);
    var x = parseInt(document.getElementById("x").value);
    var y = parseInt(document.getElementById("y").value);
    for(var i=0;i<x;i++){
        environmentOfAll[i]=new Array();
            for(var j=0;j<y;j++){
                environmentOfAll[i][j]=1;
            }
        }

    console.log(typeof(x));
    console.log(Number.isInteger(x));
    if(Number.isInteger(x)&& Number.isInteger(y) && x>0 && y>0 && x<16 && y<16){

    var map = paper.set();
    for(var i = 0; i<x;i++){
        for(var j = 0; j<y;j++){
            var block = paper.rect((((1280-x*50)/2)+i*50),(100+j*50),50,50);
            block.data("x" , i );
            block.data("y", j );
            map.push(block);
        }
    }

    map.attr({fill: "#389CDE"});
    map.click(function(){
    var tx = this.data("x");
    var ty = this.data("y");
    if($("#agent").is(':checked') == true){
        paper.text((((1280-environmentOfAll.length*50)/2)+tx*50+10),(110+ty*50),agentCount+1)
        this.attr({fill:"#E7E421"});
        var agent = {};
        agent.id = agentCount+1;
        agent.position = {x:tx+1,y:ty+1};
        agent.region = regionCount+1;
        agentArray.push(agent);
        environmentOfAll[tx][ty] = 0;
        agentCount++;

    }else{
        this.attr({fill:"#FDFEFE"});
        temporaryRegion.push({x:tx+1 , y:ty+1});
        environmentOfAll[tx][ty] = 0;
    }
    });

    map.dblclick(function(){
    var tx = this.data("x");
    var ty = this.data("y");

    this.cx = this.cx || 300;
    this.animate({cx: this.cx, fill: "#389CDE", "fill-opacity": +!!(this.cx - 100)}, 400);
    environmentOfAll[this.data("x")][this.data("y")] = 1;
    });
}
else{
alert('Please type in right number', 'ERROR');
}
};

function createRegion(){
    var region = {};
    region.id = regionCount+1;
    region.openSpaces = temporaryRegion;
    wholeRegion.push(region);
    regionCount++;
    temporaryRegion = [];
};

function confirm(){
    rawEnvironment.agents = agentArray;
    rawEnvironment.regions = wholeRegion;
    rawEnvironment.size = {x:environmentOfAll.length,y:environmentOfAll[0].length};
    drawEnvironment(rawEnvironment);
    showGuidelines(rawEnvironment);
    environment = rawEnvironment;
};

function runOnce() {
    paper.remove();
    currentAgent = [];
    var envi = environment;
    // var resultOfMove = move(agentArray,environmentOfAll);
    var resultOfMove = getAgentPath();

    paper = Raphael("holderOfBlock",1280,680);
//-----------------------------block-----------------------------------------
    drawEnvironment(environment);
    drawPath(resultOfMove);
    showGuidelines(environment);
};

function run() {
    var steps = $("#steps").val();
    for(var i = 0 ; i< steps ; i++){
        runOnce();
    }
};

function switchView(){
    if($("#graphView").is(':checked') == true){
        paper.remove();
        var mapForGra = [];
        for(var i = 0 ; i<environmentOfAll.length ; i++){
            for(var j = 0 ; j<environmentOfAll.length ; j++){
                if(environmentOfAll[i][j] == 0){
                    mapForGra.push({x : i , y : j});
                }
            }
        }
        console.log(currentAgent);
        if(firstCreateGraph){
            graph(mapForGra,currentAgent);
            firstCreateGraph=false;
        }
        switchGraph();

    }else{
        currentStep--;
        runOnce();
        switchGraph();
    }
};

function drawEnvironment(envi){
    for(var i = 0; i < envi.regions.length ; i++){
        if(!envi.regions[i].color){
            envi.regions[i].color = randomColor();
        }
    }

    for(var i = 0; i < envi.agents.length ; i++){
        if(!envi.agents[i].color){
            envi.agents[i].color = randomColor();
        }
    }
    var map = paper.set();
    for(var i = 0; i<envi.size.x;i++){
        for(var j = 0; j<envi.size.y;j++){
            var block = paper.rect((((1280-envi.size.x*50)/2)+i*50),(100+j*50),50,50);
            block.data("x" , i );
            block.data("y", j );
            map.push(block);
        }
    }
    map.attr({fill: "#389CDE"});

    for(var i = 0; i < envi.regions.length ; i++){
        for(var j = 0; j < envi.regions[i].openSpaces.length ; j++){
                map.forEach(function(e){
                    if(e.data("x")==envi.regions[i].openSpaces[j].x-1 && e.data("y") == envi.regions[i].openSpaces[j].y-1){
                        e.attr({fill:"#FDFEFE" , stroke:envi.regions[i].color, "stroke-width":2});
                    }
                })
        }
    }

    for(var i = 0 ; i<envi.agents.length ; i++){
        var x = (((1280-envi.size.x*50)/2)+(envi.agents[i].position.x-1)*50)+25;
        var y = (100+(envi.agents[i].position.y-1)*50)+25;
        var node = paper.circle(x,y,7);
        node.attr({fill: envi.agents[i].color});
        paper.text(x,y,envi.agents[i].id);
    }
}

function drawPath(r){
    var envi = environment;
    var setPath = [];
    for(var i =0; i<r.length;i++){
        if(currentStep == 0){
            var agentStartX = (((1280-envi.size.x*50)/2)+(envi.agents[i].position.x-1)*50)+25;
            var agentStartY = (100+(envi.agents[i].position.y-1)*50)+25;
            var agentEndX = (((1280-envi.size.x*50)/2)+(r[i].path[currentStep][0])*50)+25;
            var agentEndY = (100+(r[i].path[currentStep][1])*50)+25;
        } else if(r[i].path[currentStep]){
            var agentStartX = (((1280-envi.size.x*50)/2)+(r[i].path[currentStep-1][0])*50)+25;
            var agentStartY = (100+(r[i].path[currentStep-1][1])*50)+25;
            var agentEndX = (((1280-envi.size.x*50)/2)+(r[i].path[currentStep][0])*50)+25;
            var agentEndY = (100+(r[i].path[currentStep][1])*50)+25;
        } else if(r[i].path[currentStep-1]){
            var agentStartX = (((1280-envi.size.x*50)/2)+(r[i].path[currentStep-1][0])*50)+25;
            var agentStartY = (100+(r[i].path[currentStep-1][1])*50)+25;
            var agentEndX = (((1280-envi.size.x*50)/2)+(r[i].path[r[i].path.length-1][0])*50)+25;
            var agentEndY = (100+(r[i].path[r[i].path.length-1][1])*50)+25;
        } else {
            var agentStartX = (((1280-envi.size.x*50)/2)+(r[i].path[r[i].path.length-2][0])*50)+25;
            var agentStartY = (100+(r[i].path[r[i].path.length-2][1])*50)+25;
            var agentEndX = (((1280-envi.size.x*50)/2)+(r[i].path[r[i].path.length-1][0])*50)+25;
            var agentEndY = (100+(r[i].path[r[i].path.length-1][1])*50)+25;
        }
        var singlePath = [["M",agentStartX,agentStartY],["L",agentEndX,agentEndY]];
        setPath.push(singlePath);
    }
    wholePath.push(setPath);
    for(var i = 0 ; i < wholePath.length;i++){
        for(var j = 0; j< wholePath[i].length ; j++){
            paper.path(wholePath[i][j]).attr({stroke : envi.agents[j].color, "stroke-width":2 });
        }
    }
}

function showGuidelines(environment){
    var envi = environment;
    for(var i = 0 ; i<envi.agents.length ; i++){
        var x = 50;
        var y = i*50+120;
        var node = paper.circle(x,y,7);
        node.attr({fill: envi.agents[i].color})
        node.data("id" , i+1 );
        paper.text(75,i*50+120," : "+envi.agents[i].id);
        node.click(function(){
            comeToTop(this.data("id"));
        });
    }

    for(var i = 0 ; i<envi.regions.length ; i++){
        var x = 200;
        var y = i*50+120;
        var node = paper.rect(x,y,25,25);
        node.attr({fill:"#FDFEFE" , stroke:envi.regions[i].color, "stroke-width":2});
        paper.text(235,i*50+140," : "+envi.regions[i].id);
    }
}

function comeToTop(aid){
    console.log(aid);
    for(var i = 0 ; i < wholePath.length;i++){
        for(var j = 0; j< wholePath[i].length ; j++){
            if( j+1 == aid){
                paper.path(wholePath[i][j]).attr({stroke : environment.agents[j].color, "stroke-width":2 });
            }
        }
    }
}

    function switchView(){
        if($("#graphView").is(':checked') == true){
            paper.remove();
            if(firstCreateGraph){
                graph(getEnvironment(),1,getAgentPath(),1,2);
                firstCreateGraph=false;
            }
            switchGraph()
        }else{
            currentStep--;
            runOnce();
            switchGraph()
        }
    }

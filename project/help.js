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
var wholePath = [];
var stateOfView = false;
var currentRegion = 0;
var algoType="";
var resultOfMove = {};

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
    $.ajax({
        url: "/file",
        method: "GET",
        data: { environment: rawEnvironment},
        success: showAgentsPathForClick,
        error: function (data) {
            alert("error");
        }
    });
};

function showSelectPage(){
    window.location.reload();
}

function setAlgorithmsType(){
    algoType=$('#algorithmsType').find(":selected").text();
    $('#guidMenu').hide();
    $('#regionMenu').show();
    $('#runMenu').show();
    $('#saveMenu').show();
    $('#algorithmName').text(getAlgorithmsType());
    $('#algorithmName').show();
}

function getAlgorithmsType(){
    console.log(algoType);
    return algoType;
}

function getTotalSteps(){
    return currentStep;
}

function showAgentsPathForClick(result){
    paper = Raphael("holderOfBlock",1280,1280);

    drawEnvironment(rawEnvironment);
    showGuidelines(rawEnvironment);
    agentPath=result;
}

function runOnce() {
     currentStep++;
     var maxPath=0;
     var ap=getAgentPath();
     ap.forEach((a)=>{
        if(maxPath<=a.path.length-1){
            maxPath=a.path.length-1;
        }
     });
     if(currentStep>=maxPath){//complete all pathes
        swal("Completed, now you can save the run!");
        $('#saveRun').show();
     }

    if(!stateOfView){
        paper.remove();
        currentAgent = [];
        paper = Raphael("holderOfBlock",1280,1280);
//-----------------------------block-----------------------------------------
        drawEnvironment(rawEnvironment,resultOfMove);
        drawPath(resultOfMove,currentStep);
        showGuidelines(rawEnvironment,resultOfMove);
    } else {
         graph(getEnvironment(),currentRegion,getAgentPath(),currentStep,getTargetList(),getCurrentTarget());
         drawPath(resultOfMove,currentStep);
    }
    
};

function run() {
    var steps = $("#steps").val();
    for(var i = 0 ; i< steps ; i++){
        runOnce();
    }
};

function drawEnvironment(environ,pth){
    // var envi = environ;
    var envi = jQuery.extend(true, {}, environ);

    resultOfMove = jQuery.extend(true, [], pth);
    rawEnvironment = envi;
    for(var i = 0; i < envi.regions.length ; i++){
        if(currentStep == 0){
            envi.regions[i].colorOfRegion = randomColor();
        }
    }

    for(var i = 0; i < envi.agents.length ; i++){
        if(currentStep == 0){
            envi.agents[i].colorOfAgent = randomColor();
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
        var rawX = envi.regions[i].openSpaces[0].x;
        var rawY = envi.regions[i].openSpaces[0].y;
        var regionX = (((1280-envi.size.x*50)/2)+(rawX-1)*50+10);
        var regionY = (100+(rawY-1)*50 + 10);
        paper.text(regionX,regionY,i+1);
        for(var j = 0; j < envi.regions[i].openSpaces.length ; j++){
                map.forEach(function(e){
                    if(e.data("x")==envi.regions[i].openSpaces[j].x-1 && e.data("y") == envi.regions[i].openSpaces[j].y-1){
                        e.attr({fill:"#FDFEFE" , stroke:"#000000", "stroke-width":2});
                    }
                })
        }
    }

    for(var i = 0 ; i<envi.agents.length ; i++){
        var x = (((1280-envi.size.x*50)/2)+(envi.agents[i].position.x-1)*50)+25;
        var y = (100+(envi.agents[i].position.y-1)*50)+25;
        var node = paper.circle(x,y,7);
        node.attr({fill: envi.agents[i].colorOfAgent});
        paper.text(x,y,envi.agents[i].id);
    }
};

function drawPath(r,totalSteps){
    var envi = rawEnvironment;
    console.log(envi);
    var setPath = [];
    for(var i =0; i<r.length;i++){

        if(totalSteps == 0){
            var agentStartX = (((1280-envi.size.x*50)/2)+(envi.agents[i].position.x-1)*50)+25;
            var agentStartY = (100+(envi.agents[i].position.y-1)*50)+25;
            var agentEndX = (((1280-envi.size.x*50)/2)+(r[i].path[totalSteps][0])*50)+25;
            var agentEndY = (100+(r[i].path[totalSteps][1])*50)+25;
        } else if(r[i].path[totalSteps]){
            var agentStartX = (((1280-envi.size.x*50)/2)+(r[i].path[totalSteps-1][0])*50)+25;
            var agentStartY = (100+(r[i].path[totalSteps-1][1])*50)+25;
            var agentEndX = (((1280-envi.size.x*50)/2)+(r[i].path[totalSteps][0])*50)+25;
            var agentEndY = (100+(r[i].path[totalSteps][1])*50)+25;
        } else if(r[i].path[totalSteps-1]){
            var agentStartX = (((1280-envi.size.x*50)/2)+(r[i].path[totalSteps-1][0])*50)+25;
            var agentStartY = (100+(r[i].path[totalSteps-1][1])*50)+25;
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
            try{
                paper.path(wholePath[i][j]).attr({stroke : envi.agents[j].colorOfAgent, "stroke-width":2 });
            }catch(e){}  
        }
    }
}

function showGuidelines(path){
    var envi = rawEnvironment;
    var p = path;
    for(var i = 0 ; i<envi.agents.length ; i++){
        var x = 50;
        var y = i*50+120;
        var node = paper.circle(x,y,7);
        node.attr({fill: envi.agents[i].colorOfAgent})
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
        node.attr({fill:"#FDFEFE" , stroke:envi.regions[i].colorOfRegion, "stroke-width":2});
        node.data("id" , i +1);
        paper.text(235,i*50+140," : "+envi.regions[i].id);
        node.click(function(){
            paper.remove();
            currentRegion = this.data("id");
            graph(getEnvironment(),currentRegion,getAgentPath(),currentStep,getTargetList(),getCurrentTarget());
            switchGraph();
            $("#returnButton").show();
            stateOfView=true;
        });
    }
}

function comeToTop(aid){
    for(var i = 0 ; i < wholePath.length;i++){
        for(var j = 0; j< wholePath[i].length ; j++){
            if( j+1 == aid){
                paper.path(wholePath[i][j]).attr({stroke : rawEnvironment.agents[j].colorOfAgent, "stroke-width":2 });
            }
        }
    }
}

    function returnToBlock(){
            $("#returnButton").hide();
            switchGraph();
            stateOfView=false;
            currentStep--;
            runOnce();    
    }


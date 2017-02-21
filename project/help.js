    var temporaryRegion = [];
    var wholeRegion = [];
    var environment = [];
    var agentArray = [];
    var agentCount = 0;
    var currentStep = 1;
    var currentAgent = [];
    var paper = {};
    var firstCreateGraph=true;

    function init() {
        paper = Raphael("holderOfBlock",1280,1280);
        var x = parseInt(document.getElementById("x").value);
        var y = parseInt(document.getElementById("y").value);
        for(var i=0;i<x;i++){    
            environment[i]=new Array();  
                for(var j=0;j<y;j++){   
                    environment[i][j]=1;
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
            paper.text((((1280-environment.length*50)/2)+tx*50+10),(110+ty*50),agentCount+1)
            this.attr({fill:"#E7E421"});
            var agent = {};
            agent.id = agentCount+1;
            agent.x = tx;
            agent.y = ty;
            agentArray.push(agent);
            environment[tx][ty] = 0;
            agentCount++;      
        }else{
            this.attr({fill:"#FDFEFE"});        
            environment[tx][ty] = 0;
        }
        });

        map.dblclick(function(){
        var tx = this.data("x");
        var ty = this.data("y");

        this.cx = this.cx || 300;
        this.animate({cx: this.cx, fill: "#389CDE", "fill-opacity": +!!(this.cx - 100)}, 400);
        environment[this.data("x")][this.data("y")] = 1;
        });
    }
	else{
	alert('Please type in right number', 'ERROR');
	}
    };

    function confirm(){
        runOnce();

    };

    function runOnce() {
        paper.remove();
        currentAgent = [];
        var resultOfMove = move(agentArray,environment);
        paper = Raphael("holderOfBlock",1280,680);

    //-----------------------------block-----------------------------------------
        for(var i = 0; i<environment.length;i++){
            for(var j = 0 ; j<environment[i].length;j++){
                var block = paper.rect((((1280-environment.length*50)/2)+i*50),(100+j*50),50,50);
                if(environment[i][j]==0){
                    block.attr({fill:"#FDFEFE"});
                }else{
                    block.attr({fill: "#389CDE"});
                }
            }
        }
        for (var [key, value] of resultOfMove) {
            console.log(resultOfMove);
        for(var i=0;i<currentStep;i++){
            if(currentStep<value.length){
            console.log(value.length);
            console.log(key + ' => [' + value[i].x+","+value[i].y+"]");
            var block = paper.rect((((1280-environment.length*50)/2)+value[i].x*50),(100+value[i].y*50),50,50);
            paper.text((((1280-environment.length*50)/2)+value[currentStep-1].x*50+10),(110+value[currentStep-1].y*50),key)
            block.attr({fill:"#E7E421"});
            if(i==currentStep-1){
                var agent = {};
                agent.id = key;
                agent.x = value[i].x;
                agent.y = value[i].y
                currentAgent.push(agent);
            }
            
            }else{
                console.log("else")
                console.log(key + ' => [' + value[value.length-1].x+","+value[value.length-1].y+"]");
                for(var j = 0; j<value.length;j++){
                var block = paper.rect((((1280-environment.length*50)/2)+value[j].x*50),(100+value[j].y*50),50,50);
                paper.text((((1280-environment.length*50)/2)+value[value.length-1].x*50+10),(110+value[value.length-1].y*50),key)
                block.attr({fill:"#E7E421"});
                    }
                var agent = {};
                agent.id = key;
                agent.x = value[value.length-1].x;
                agent.y = value[value.length-1].y;
                console.log(value.length+"+"+currentStep);
                if(value.length<=currentStep)
                currentAgent.splice(-1,1);
                currentAgent.push(agent);
                }
            }
        }
    //-----------------------------graph-----------------------------------------
        var mapForGra = [];
        for(var i = 0 ; i<environment.length ; i++){
            for(var j = 0 ; j<environment.length ; j++){
                if(environment[i][j] == 0){
                    mapForGra.push({x : i , y : j});
                }
            }
        }
        graph(mapForGra,currentAgent);
        hideGraph();
        currentStep++;

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
            for(var i = 0 ; i<environment.length ; i++){
                for(var j = 0 ; j<environment.length ; j++){
                    if(environment[i][j] == 0){
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
    }





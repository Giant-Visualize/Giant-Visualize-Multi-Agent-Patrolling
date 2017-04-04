
var times=85;
var leftGap=250;
var topGap=50;
var radius=20;
var min={};

function switchGraph(){
    var c = document.getElementById("myCanvas");
    if(c.style.visibility=='visible'){
        c.style.visibility='hidden';
    }else{
        c.style.visibility='visible';
    }
}

function graph(Environment,regionID,agentPath,totalSteps,targetList,currentTarget){
    var environment = jQuery.extend(true, {}, Environment);

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    var region=[];// get particular region
    environment.regions.forEach((r)=>{
        if(r.id==regionID){
            region=r;
            return;
        }
    });


    // var agent=[]; // get all agents in particular region
    // environment.agents.forEach((a)=>{
    //     if(a.region==regionID){
    //         agent.push(a);
         
    //     }
    // });

    var currentAgent=[]; // get all agents in particular region
    agentPath.forEach((a)=>{
        if(a.region==regionID){
            currentAgent.push(a);
        }
    });

    
      
    draw();
    
    $('#target').dblclick(function(e) {
      var offset = $(this).offset();
      var x=e.pageX - offset.left;
      var y=e.pageY - offset.top;
    
      var showAgent=[];

      region.openSpaces.forEach((node)=>{
            if(Math.abs(leftGap+times*(node.x-min.x+1)-x)<=radius&&Math.abs(topGap+times*(node.y-min.y+1)-y)<=radius){
                currentAgent.forEach((a) => {    //agent visist this open space
                    var step=totalSteps;
                    if(step>a.path.length-1)  step=a.path.length-1; //indentify Nst step

                    if(a.path[step][0]+1==node.x&&a.path[step][1]+1==node.y){
                        showAgent.push(a);
                    }
                });
            }
       });

       var agentInfo="";
       if(showAgent.length>=1){
            showAgent.forEach((a)=>{
                var step=totalSteps;
                if(step>a.path.length-1)  step=a.path.length-1; //indentify Nst step

                agentInfo+="Id: "+a.id+"\n"+"Coordinate: "+"("+(a.path[step][0]+1)+","+(a.path[step][1]+1)+")"+"\n";
                agentInfo+="\n";
                swal("",agentInfo, "success")
 
        });
       }else{
            agentInfo+="No agent here !"
             swal("",agentInfo, "error")
       }
       
    });

  function draw() {
            min.x=region.openSpaces[0].x;
            min.y=region.openSpaces[0].y;
            region.openSpaces.forEach((node) => {   //find minX and minY
                if(min.x-node.x>0) min.x=node.x;
                if(min.y-node.y>0) min.y=node.y;
             });
            region.openSpaces.forEach(drawNode); //draw circle

            region.openSpaces.forEach((node1) => {   //draw lines
                region.openSpaces.forEach((node2) => {
                ctx.beginPath();
                ctx.strokeStyle = '#FF99CC';

                if(node1.x==node2.x&&node1.y==node2.y-1){
                    ctx.moveTo(leftGap+times*(node1.x-min.x+1),topGap+times*(node1.y-min.y+1)+radius);
                    ctx.lineTo(leftGap+times*(node2.x-min.x+1),topGap+times*(node2.y-min.y+1)-radius);
                 }

                if(node1.x==node2.x-1&&node1.y==node2.y){
                    ctx.moveTo(leftGap+times*(node1.x-min.x+1)+radius,topGap+times*(node1.y-min.y+1));
                    ctx.lineTo(leftGap+times*(node2.x-min.x+1)-radius,topGap+times*(node2.y-min.y+1));    
                }   
                ctx.stroke();
                });
            });

            region.openSpaces.forEach(drawText); // draw coordinate
    /* ********************************************** */ //show target list
            var max=0;
            max=region.openSpaces[0].x;
            for(var i=0;i<region.openSpaces.length;i++){   
                if(max-region.openSpaces[i].x<0){   
                    max=region.openSpaces[i].x;
                }
            }

            var i=2.5;  // show taget list
            var j=1;
            ctx.fillStyle = 'black';
            ctx.font="18px Times New Roman";
            ctx.fillText("Target list",leftGap+times*(max-min.x+i),topGap+times*(j));
            j+=0.5;

            if(totalSteps<targetList.length){
                targetList[totalSteps].forEach((t)=>{
                if(t.regionId==regionID){
                    ctx.fillText("("+t.position.x+","+t.position.y+")",(leftGap+times*(max-min.x+i)),topGap+times*(j));
                    i+=0.6;
                }
                });
            }
           
                i=2.5; //show current target
                j=2;
                ctx.fillText("Agent",leftGap+times*(max-min.x+2.5),topGap+times*(j));
                ctx.fillText("Current target",leftGap+times*(max-min.x+2.5)+150,topGap+times*(j));

                var m=0;
                currentAgent.forEach((ca)=>{
                    m=0;
                    while(m<currentTarget.length&&(ca.id!=(currentTarget[m].id)||currentTarget[m].index<=totalSteps)){
                            m++;          
                    }
                    if(m<currentTarget.length){
                        j+=0.5;
                        ctx.fillText("Agent"+currentTarget[m].id,leftGap+times*(max-min.x+2.5),topGap+times*(j));
                        ctx.fillText("("+(currentTarget[m].x+1)+","+(currentTarget[m].y+1)+")",leftGap+times*(max-min.x+2.5)+150,topGap+times*(j));
                    }
                });   
           
            /* ********************************************** */

  }

  function drawNode(d) {
      ctx.beginPath();
      ctx.strokeStyle = '#66CCCC';
      ctx.arc(leftGap+times*(d.x-min.x+1), topGap+times*(d.y-min.y+1), radius,0,  2 * Math.PI);
   
        currentAgent.forEach((a) => {    //agent visist this open space
            var step=totalSteps;
            if(step>a.path.length-1)  step=a.path.length-1; //indentify Nst step

            for(i=0;i<=step;i++){
                    if(a.path[i][0]+1==d.x&&a.path[i][1]+1==d.y){
                        ctx.fillStyle = '#66CCCC';
                        ctx.fill();    
                    }
            }
        });

      ctx.stroke();
  }



  function drawText(d) {
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.textAlign="center";
      ctx.font="15px Arial";

      var count=0;
      currentAgent.forEach((a) => {    //agent visist this open space
            var step=totalSteps;
            if(step>a.path.length-1)  step=a.path.length-1; //indentify Nst step

            if(a.path[step][0]+1==d.x&&a.path[step][1]+1==d.y){
                count++; 
            }
      });

      ctx.fillText(count, leftGap+times*(d.x-min.x+1), topGap+times*(d.y-min.y+1)+4);
      ctx.textAlign="start";
      ctx.font="13px Arial";
      ctx.fillText("("+d.x+","+d.y+")", leftGap+times*(d.x-min.x+1)+radius, topGap+times*(d.y-min.y+1)-radius);
  }

}


// function getAgentPath(){
//     var path=[];
//     path.push({"id":"1","region":"1","path":[[2,1],[2,2],[1,2],[1,3],[1,4]]});
//     path.push({"id":"2","region":"1","path":[[1,4],[1,3],[1,2],[1,3],[0,3],[0,4],[0,5]]});
//     path.push({"id":"3","region":"2","path":[[4,1],[4,0],[4,1],[5,1],[6,1],[5,1],[4,1],[4,2],[4,3],[5,3],[6,3],[7,3]]})
//     path.push({"id":"4","region":"3","path":[[3,5],[4,5],[4,6],[5,6],[6,6],[6,5],[6,6],[5,6],[4,6]]});
//     path.push({"id":"5","region":"3","path":[[4,6],[4,5],[4,6],[3,6],[4,6],[5,6],[6,6]]});
//     path.push({"id":"6","region":"4","path":[[9,3],[9,4]]});
//     path.push({"id":"7","region":"4","path":[[8,5],[8,4],[8,5]]});
//     return path;
// }



// function test1(){
//     var environment = {};
//     var regions = [];
//     var openSpaces = [];
//     var agents = [];
//     position={};
//     var size={x:10,y:7};
   
//     openSpaces.push({x:2,y:2});
//     openSpaces.push({x:3,y:2});
//     openSpaces.push({x:2,y:3});
//     openSpaces.push({x:3,y:3});
//     openSpaces.push({x:1,y:4});
//     openSpaces.push({x:2,y:4});
//     openSpaces.push({x:1,y:5});
//     openSpaces.push({x:2,y:5});
//     openSpaces.push({x:1,y:6});
//     openSpaces.push({x:2,y:6});
//     regions.push({id:1,openSpaces:openSpaces});

//     var openSpaces = [];
//     openSpaces.push({x:5,y:1});
//     openSpaces.push({x:5,y:2});
//     openSpaces.push({x:6,y:2});
//     openSpaces.push({x:7,y:2});
//     openSpaces.push({x:5,y:3});
//     openSpaces.push({x:5,y:4});
//     openSpaces.push({x:6,y:4});
//     openSpaces.push({x:7,y:4});
//     openSpaces.push({x:8,y:4});
//     regions.push({id:2,openSpaces:openSpaces});

//     var openSpaces = [];
//     openSpaces.push({x:4,y:5});
//     openSpaces.push({x:4,y:6});
//     openSpaces.push({x:5,y:6});
//     openSpaces.push({x:7,y:6});
//     openSpaces.push({x:4,y:7});
//     openSpaces.push({x:5,y:7});
//     openSpaces.push({x:6,y:7});
//     openSpaces.push({x:7,y:7});
//     regions.push({id:3,openSpaces:openSpaces});

//     var openSpaces = [];
//     openSpaces.push({x:10,y:3});
//     openSpaces.push({x:10,y:4});
//     openSpaces.push({x:9,y:5});
//     openSpaces.push({x:10,y:5});
//     openSpaces.push({x:9,y:6});
//     openSpaces.push({x:9,y:7});
//     regions.push({id:4,openSpaces:openSpaces});

//     agents.push({id:1,position:{x:2,y:2},region:1});
//     agents.push({id:2,position:{x:2,y:6},region:1});
//     agents.push({id:3,position:{x:5,y:3},region:2});
//     agents.push({id:4,position:{x:4,y:5},region:3});
//     agents.push({id:5,position:{x:6,y:7},region:3});
//     agents.push({id:6,position:{x:10,y:3},region:4});
//     agents.push({id:7,position:{x:9,y:7},region:4});

//     environment.size=size;
//     environment.regions=regions;
//     environment.agents=agents;
   
//     return environment;
// }   



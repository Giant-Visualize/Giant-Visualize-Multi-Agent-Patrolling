var times=80;
var leftGap=100;
var topGap=100;

function graph(region,agent){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    draw();

    $('#target').dblclick(function(e) {
      var offset = $(this).offset();
      var x=e.pageX - offset.left;
      var y=e.pageY - offset.top;

      region.forEach((node)=>{
          if(Math.abs(leftGap+times*node.x-x)<=10&&Math.abs(topGap+times*node.y-y)<=10){
            alert(times*node.x+","+times*node.y);
          }
      });
    });

  function draw() {
    region.forEach(drawNode); 

    region.forEach((node1) => {
        region.forEach((node2) => {
          ctx.beginPath();
          ctx.strokeStyle = '#CCFFFF';

          if(node1.x==node2.x&&node1.y==node2.y-1){
              ctx.moveTo(leftGap+times*node1.x,topGap+times*node1.y+10);
              ctx.lineTo(leftGap+times*node2.x,topGap+times*node2.y-10);
          }

          if(node1.x==node2.x-1&&node1.y==node2.y){
              ctx.moveTo(leftGap+times*node1.x+10,topGap+times*node1.y);
              ctx.lineTo(leftGap+times*node2.x-10,topGap+times*node2.y);    
          }   

          ctx.stroke();
      });
    });

    region.forEach(drawText);
  }

  function drawNode(d) {
      ctx.beginPath();
      ctx.strokeStyle = '#99CCFF';
      ctx.arc(leftGap+times*d.x, topGap+times*d.y, 10,0,  2 * Math.PI);
      ctx.stroke();
  }

  function drawText(d) {
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.textAlign="center";

      var count=0;
      agent.forEach((a) => {    
        if(a.x==d.x&&a.y==d.y) count++;          
      });
      
      ctx.fillText(count, leftGap+times*d.x, topGap+times*d.y+4);
      ctx.textAlign="start";
      ctx.fillText("("+d.x+","+d.y+")", leftGap+times*d.x+10, topGap+times*d.y-10);
  }
}
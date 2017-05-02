

function jumpToHistoryPage(){
    window.location.href = "history.html";

}


function loadWindow(){
    $('#datepicker').datepicker();
    $('#inputTime').bootstrapMaterialDatePicker({ date:false,format : 'HH:mm' });
}
    


function getSearchDate(){
    var date="";
    if($( '#datepicker').val()){
        date=formatDate($( '#datepicker').val()); //get input value
    }
    return date;
}

function getInputTime(){
    var time="";
    if($('#inputTime').val()){
        time=($('#inputTime').val()); //get input value
    }
    return time;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatTime(date) {
    var d = new Date(date),
        min = '' + d.getMinutes(),
        hour = d.getHours();

    if (min<10) month = '0' + min;
    if (hour<10) hour = '0' + hour;

    return [hour,min].join(':');
}

function getRunInfo() {

   id=$('#inputId').val();
   var date=getSearchDate();
   var time=getInputTime();
console.log(date);
console.log(time);
   var size=$('#inputSize').val();
   var region=$('#inputRegion').val();
   var step=$('#inputStep').val();
      $.ajax({
        url: "/history",
        method: "GET",
        data: { 
            date: date,
            id:id,
            time:time,
            size:size,
            region:region,
            step:step
        },
        success:loadInfo,
      });

    

}

function loadInfo(runInfo) {
    $('.collapsible').empty();

    if(runInfo.length==0){//error message
        alert("No data, Please retry!");
    }

    $.each(runInfo, function(i, item) {
        $('.collapsible').append(
            "<li>"+
                "<div class='collapsible-header'>"+"<span style='font-weight: bold;font-size:16px;'>"+item.id+"</span>"+
                "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+formatDate(item.date)+"&nbsp"+item.time+"<br>"
                +"<span style='color:grey;font-size:13px;'>"+item.description+"</span>"+"</div>"+
                "<div class='collapsible-body'>"+"<span>"+diplay(item)+"</span>"+"</div>"+
            "</li>"
        )
    });
}

function diplay(oneRunInfo){   //set diplay content and format
    var result="";
    var step=0;
    var coordinate=JSON.parse(oneRunInfo.coordinate);
    var agentpath=JSON.parse(oneRunInfo.agentPath);
    var t=JSON.parse(oneRunInfo.targetList);
    console.log(t);

    result+="Environment Size:&nbsp"+oneRunInfo.environment+"<br>";
    result+="Total steps:&nbsp"+oneRunInfo.step+"<br>";
    coordinate.forEach((c)=>{
        result+="Region"+c.id+":"+"<br>"+"&nbsp&nbsp&nbsp&nbsp&nbsp"+"Open spaces: ";
        c.openSpaces.forEach((o)=>{
            result+="("+o.x+","+o.y+")"+" ";
        });
        result+="<br>"+"&nbsp&nbsp&nbsp&nbsp&nbsp";

        agentpath.forEach((a)=>{
            if(a.region==c.id){
                result+="Agent"+a.id+":"+"<br>"+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+"Path: ";
                a.path.forEach((p)=>{
                    result+="("+(p[0]+1)+","+(p[1]+1)+")"+" ";
                });
                result+="<br>"+"&nbsp&nbsp&nbsp&nbsp&nbsp";          
            }
        });
        result+="TargetList:";
        var N=0;
        if(oneRunInfo.step>t.length){
            N=t.length-1;
        }else{
            N=oneRunInfo.step;
        }
            for(var i=0;i<=N-1;i++){ 
                    if(t[i].length!=0){
                        var find=false;
                         for(var j=0;j<t[i].length;j++){
                            if(t[i][j].regionId==c.id){
                                find=true;
                            }
                         }  
                         if(find){
                            result+="<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspStep"+i+":&nbsp";
                         }                     
                        
                        for(var j=0;j<t[i].length;j++){
                            if(t[i][j].regionId==c.id){
                                result+="("+(t[i][j].position.x)+","+(t[i][j].position.y)+")"+" ";
                            }
                        }
                    }
            }

    result+="<br>";  
    });
    return result;
}

function saveRunInfo(Environment, AgentPath,step,targetList) {
    // var date=new Date();
    // var timestamp=Math.round(date.getTime());
    // var d=new Date(timestamp);
    // var s=(d.getMonth()+1)+'-' + date.getDate() + '-' + date.getFullYear();
    swal({
        title: "Description!",
        text: "Write something interesting:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Write something"
    },
    function(inputValue){
        if (inputValue === false) return false;

        swal("Nice!", "You wrote: " + inputValue, "success");
       
        var envi = jQuery.extend(true, {}, Environment);
        var agp=jQuery.extend(true, [], AgentPath);

        var date=formatDate(new Date()); //get YY-MM-DD
        var time=formatTime(new Date()); //get HH-MM
        console.log(time);

        var size=envi.size.x+"X"+envi.size.y;

        var coordinate=JSON.stringify(envi.regions);

        var targetlist=JSON.stringify(targetList);


        var agentpath=JSON.stringify(agp);

        var regionNumber=envi.regions.length;
        console.log(regionNumber);

        $.ajax({
            url: "/saveRun",
            method: "POST",
            data: {
                date:date,
                time:time,
                size:size,
                coordinate:coordinate,
                targetlist: targetlist,
                agentpath: agentpath,
                step:step,
                description:inputValue,
                regionNumber:regionNumber,
            },

        });
    });
}




function jumpToHistoryPage(){
    window.location.href = "history.html";

}
window.onload = function(){
    chooseDate();
};  

function chooseDate(){
    $( '#datepicker').datepicker();
}



function getSearchDate(){
    var date="";
    if($( '#datepicker').val()){
        date=formatDate($( '#datepicker').val()); //get input value
    }
    return date;
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

function getRunInfo(date,id) {
   if(date==""){
        date=formatDate(new Date());
   }

console.log(date);
    
    $.ajax({
        url: "/history",
        method: "GET",
        data: { date: date},
        success:loadInfo,
    });
}

function loadInfo(runInfo) {
    $('.collapsible').empty();

    if(runInfo.length==0){//error message
        alert("Retry!");
    }

    $.each(runInfo, function(i, item) {
        $('.collapsible').append(
            "<li>"+
                "<div class='collapsible-header'>"+formatDate(item.date)+"<br>"+item.id+"</div>"+
                "<div class='collapsible-body'>"+"<span>"+diplay(item)+"</span>"+"</div>"+
            "</li>"
        )
    });
}

function diplay(oneRunInfo){   //set diplay content and format
    var result="";
    var coordinate=JSON.parse(oneRunInfo.coordinate);
    var agentpath=JSON.parse(JSON.parse(oneRunInfo.agentPath));

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
        result+="<br>";

        
    });
    return result;
}


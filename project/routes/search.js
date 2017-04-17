var db= require("./db");
var mysql= require("mysql");

function getRunInfo(req, res,date,id,time,size,region,step){
    if(id==""&&date==""&&time==""&&size==""&&region==""&&step==""){
        var sql="SELECT * FROM runInfo";
    }else{
        var sql="SELECT * FROM runInfo WHERE";
        if(id!=""){
            sql+="id=("+mysql.escape(id)+") AND";
        }
        if(date!=""){
            sql+="date=("+mysql.escape(date)+") AND";
        }
        if(time!=""){
            sql+="time=("+mysql.escape(time)+") AND";
        }
        if(size!=""){
            sql+="size=("+mysql.escape(size)+") AND";
        }
        if(region!=""){
            sql+="region=("+mysql.escape(region)+") AND";
        }
        if(step!=""){
            sql+="step=("+mysql.escape(step)+")";
        }
    }

    console.log(sql);
    db.excuteSql(sql,function(data, err){
        console.log(data);
        if(err){
            res.writeHead(405, "Method not supported",{"Content-Type": "application/json"});
            res.write({data: "Method not supported"});  
        }else{
           res.writeHead(200,{"Content-Type": "application/json"});
             if(data){
               res.write(JSON.stringify(data));
             }
        }
        res.end();
    })
};

function saveRunInfo(req, res,date,time,size,coordinate,targetlist,agentpath,step,description,regionNumber){
    var sql="Insert INTO runInfo(date,time,environment,coordinate,targetList,agentPath,step,description,regionNumber) VALUES ("
    +mysql.escape(date)+","+mysql.escape(time)+","
    +mysql.escape(size)+","+mysql.escape(coordinate)+","+mysql.escape(targetlist)+","
    +mysql.escape(agentpath)+","+mysql.escape(step)+","+mysql.escape(description)+","+mysql.escape(regionNumber)+")";

    console.log(sql);
    db.excuteSql(sql,function(data, err){
        if(err){
            res.writeHead(405, "Method not supported",{"Content-Type": "application/json"});
            res.write({data: "Method not supported"});  
        }else{
           res.writeHead(200,{"Content-Type": "application/json"});
           console.log("Success!!!");
        }
        res.end();
    })
};

module.exports.getRunInfo=getRunInfo;
module.exports.saveRunInfo=saveRunInfo;
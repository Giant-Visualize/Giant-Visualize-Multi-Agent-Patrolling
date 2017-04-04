var db= require("./db");
var mysql= require("mysql");

function getRunInfo(req, res,date,id){
    if(id==""&&date!=""){
        var sql="SELECT * FROM runInfo WHERE date=("+mysql.escape(date)+")";
    }else if(id!=""&&date==""){
        var sql="SELECT * FROM runInfo WHERE id=("+mysql.escape(id)+")";
    }else if(id!=""&&date!=""){
        var sql="SELECT * FROM runInfo WHERE date=("+mysql.escape(date)+") AND id=("+mysql.escape(id)+")" ;
    }else{
        var sql="SELECT * FROM runInfo" ;
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

function saveRunInfo(req, res,date,time,size,coordinate,targetlist,agentpath,step,description){
    var sql="Insert INTO runInfo(date,time,environment,coordinate,targetList,agentPath,step,description) VALUES ("
    +mysql.escape(date)+","+mysql.escape(time)+","
    +mysql.escape(size)+","+mysql.escape(coordinate)+","+mysql.escape(targetlist)+","
    +mysql.escape(agentpath)+","+mysql.escape(step)+","+mysql.escape(description)+")";

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
var db= require("./db");
var mysql= require("mysql");

function getRunInfo(req, res,date,id){
    if(id==""){
        var sql="SELECT * FROM runInfo WHERE date=("+mysql.escape(date)+")";
    }else{
        var sql="SELECT * FROM runInfo WHERE date=("+mysql.escape(date)+") AND id=("+mysql.escape(id)+")" ;
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

function saveRunInfo(req, res,date,size,coordinate,targetlist,agentpath,step,description){
    var sql="Insert INTO runInfo(date,environment,coordinate,targetList,agentPath,step,description) VALUES ("+mysql.escape(date)+","
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
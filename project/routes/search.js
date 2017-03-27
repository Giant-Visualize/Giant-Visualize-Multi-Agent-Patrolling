var db= require("./db");
var mysql= require("mysql");

function getRunInfo(req, res,date){
    var sql="SELECT * FROM runInfo WHERE date=("+mysql.escape(date)+")";
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

function saveRunInfo(req, res,data){
    var sql="Insert INTO runInfo(date) VALUES ("+mysql.escape(data)+")";
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
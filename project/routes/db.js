var mysql= require("mysql");

function excuteSql(sql, callback){

    var conn= mysql.createConnection({
        host     : '127.0.0.1',
        user     : 'root',
        password : '123',
        database : 'run',
        port: 3306,
    });
    conn.connect(function (err){
        if (err) throw err;
        conn.query(sql,function(err,rows){
            if(err) throw err;
            callback(rows);
        });
      });
}

module.exports.excuteSql=excuteSql;
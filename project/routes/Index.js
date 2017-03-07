var express = require('express');
var app = express();
var algorithm=require('./algorithm')



app.use(express.static(__dirname + '/..'));

app.get('/', (req, res) => {
  res.sendFile('mainPage.html', {root: __dirname + '/..'});
});

app.get('/file', function (req, res, next) {
    environment = req.query.environment;
    console.log(environment);
    var agentsInfoStore=algorithm.getAgentPath(environment);
    console.log(agentsInfoStore);
    res.status(200).send(agentsInfoStore);
});

// app.get('/test', (req, res) => {
//   res.send({success: true});
// });

var server = app.listen(8080, function () {
   var host = '138.49.101.87'
   var port = server.address().port
   
   console.log("Giant's app is listening at http://%s:%s", host, port)
})
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var algorithm=require('./algorithm')
var search=require('./search')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

app.get('/history', function (req, res, next) {
  var date=req.query.date ;
  search.getRunInfo(req, res,date);
});

app.post('/saveRun', function (req, res, next) {
  var date=req.body.date;
  console.log(date);
  search.saveRunInfo(req, res,date);
});

// app.get('/test', (req, res) => {
//   res.send({success: true});
// });

var server = app.listen(8080, function () {
   var host = '138.49.101.87'
   var port = server.address().port
   
   console.log("Giant's app is listening at http://%s:%s", host, port)
})
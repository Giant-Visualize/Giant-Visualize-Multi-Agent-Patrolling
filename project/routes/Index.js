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
    algorithmName=req.query.algo;
    var agentsInfoStore=[];
    if(algorithmName=="constrained-3"){
        agentsInfoStore=algorithm.constrain3(environment);
    }else if(algorithmName == "constrained-4"){
	agentsInfoStore=algorithm.getAgentPath(environment);
    }else{
	agentsInfoStore = algorithm.noConstrain(environment);
    }

    res.status(200).send(agentsInfoStore);
});

app.get('/history', function (req, res, next) {
  var date=req.query.date ;
  var id=req.query.id;
  var time=req.query.time;
  var size=req.query.size;
  var region=req.query.region;
  var step=req.query.step;
  search.getRunInfo(req, res,date,id,time,size,region,step);
});

app.post('/saveRun', function (req, res, next) {
  var date=req.body.date;
  var time=req.body.time ;
  var size=req.body.size;
  var coordinate=req.body.coordinate;
  var targetlist=req.body.targetlist;  
  var agentpath=req.body.agentpath; 
  var step=req.body.step; 
  var description=req.body.description;
  var regionNumber=req.body.regionNumber;

  // console.log("--------------------");
  // console.log(date);
  // console.log(time);
  // console.log(size);
  // console.log(coordinate);
  // console.log(targetlist);
  // console.log(agentpath);
  // console.log(step);
  // console.log("--------------------");
  
  search.saveRunInfo(req, res,date,time,size,coordinate,targetlist,agentpath,step,description,regionNumber);
});

// app.get('/test', (req, res) => {
//   res.send({success: true});
// });

var server = app.listen(8080, function () {
   var host = '138.49.101.87'
   var port = server.address().port
   
   console.log("Giant's app is listening at http://%s:%s", host, port)
})

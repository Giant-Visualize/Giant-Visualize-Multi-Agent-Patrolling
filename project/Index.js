var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../project'));

app.get('/', (req, res) => {
  res.sendFile('mainPage.html', {root: __dirname + '/../project'});
});

// app.get('/test', (req, res) => {
//   res.send({success: true});
// });

var server = app.listen(3030, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
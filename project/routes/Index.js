var express = require('express');
var app = express();

app.use(express.static(__dirname + '/..'));

app.get('/', (req, res) => {
  res.sendFile('mainPage.html', {root: __dirname + '/..'});
});

// app.get('/test', (req, res) => {
//   res.send({success: true});
// });

var server = app.listen(9090, function () {
   var host = '138.49.101.87'
   var port = server.address().port
   
   console.log("Giant's app is listening at http://%s:%s", host, port)
})
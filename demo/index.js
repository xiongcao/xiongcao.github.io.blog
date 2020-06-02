var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(multer({
  dest: '/tmp/'
}).array('image'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/' + 'test.html');
})

var server = app.listen(80, function () {
  var port = server.address().port;
  console.log('访问地址：http://localhost:' + port)
})
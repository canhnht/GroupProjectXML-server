var express = require('express');
var app = express();
var xml = require('xml');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

app.use(bodyParser.xml());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.post('/', function(req, res) {
  res.set('Content-Type', 'application/xml');
  res.send(xml({nested: [{ keys: [{ fun: 'hi' }]}]}));
});

app.use(function (err, req, res, next) {
  if (err.status == 400)
    return res.status(400).send('Invalid XML.');
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

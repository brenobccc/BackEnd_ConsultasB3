const http = require('http');
const express = require('express');
const res = require('express/lib/response');
const app = express();
const url = require('url');


app.get('/', async (req, res) => {
  res.statusCode = 200;//Códig
  res.setHeader('Content-Type', 'application/json');
  res.end("Rota Principal");
})




app.get('/teste', async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end("Rota Secundária");
})



var server = app.listen(3000, function () {
  var host = "127.0.0.1";
  var port = "3000";
  console.log("App listening at http://%s:%s", host, port)
})



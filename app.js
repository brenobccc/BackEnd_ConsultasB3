const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch-commonjs');
var session = require("express-session");
const url = require('url');
var request = require('request');
const http = require('http');
//const url = require('url');
const queryString = require('query-string');
const fs = require('fs');
const res = require('express/lib/response');
const consign = require('consign');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

consign().include('routes').then('controllers').into(app);

var server = app.listen(8080, function () {
    var host = "127.0.0.1";
    console.log("App executando em http://%s:%s", host, 8080)
})

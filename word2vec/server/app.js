var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var urlMaker = require('../url_maker');
var request = require('request');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(2003);

var url = '192.168.4.13:5000'

app.get('/', function(req, res, next){
  request.get({url:url, json:true}, function (e, r, arr) {
    console.log(r);
  })
})




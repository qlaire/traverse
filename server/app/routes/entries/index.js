'use strict';
var router = require('express').Router();
var watson = require('watson-developer-cloud');
var alchemy_language = watson.alchemy_language({
  api_key: '7f8fdd07f30d9d2fd5ebf11f12c339408abf8555'
});
module.exports = router;

router.post('/analyze', function (req, res, next) {
  
})
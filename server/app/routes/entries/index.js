'use strict';
var router = require('express').Router();
var analyzeEmotion = require('../../../../utils').analyzeEmotion;
module.exports = router;

router.post('/analyze', function (req, res, next) {
  console.log('I\'m in the route---------');
  let data = analyzeEmotion(req.body.entry);
  res.send(data);
  
})
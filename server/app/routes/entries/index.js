'use strict';
var router = require('express').Router();
var analyzeEmotion = require('../../../utils').analyzeEmotion;
module.exports = router;

router.post('/analyze', function (req, res, next) {
  console.log('I\'m in the route---------');
  analyzeEmotion(req.body.entry)
  .then(results => {
    // save the results to the database
    res.send(results);
  })
  .catch(next);
})
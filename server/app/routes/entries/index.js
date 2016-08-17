'use strict';
var router = require('express').Router();
var analyzeEmotion = require('../../../utils').analyzeEmotion;
var authenticator = require('../utils');
var db = require('../../../db/_db');
var Entry = db.model('entry');
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

module.exports = router;



router.get('/', authenticator.ensureAuthenticated, function(req, res, next){
  res.sendStatus(200);
})

router.post('/', authenticator.ensureAuthenticated, function(req, res, next){
    Entry.create(req.body)
    .then(function(savedEntry){
      return savedEntry.setAuthor(req.user.id)
    }).then(function(){
        res.sendStatus(201);
    })

})

router.put('/:id', authenticator.ensureAuthenticated, function(req, res, next){
  res.sendStatus(200);
})

router.delete('/:id', authenticator.ensureAuthenticated,
              function(req, res, next){
  res.sendStatus(200);
})

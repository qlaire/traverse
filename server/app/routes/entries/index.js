'use strict';
var router = require('express').Router();
var analyzeEmotion = require('../../../utils').analyzeEmotion;
var convertWatsonDataToArr = require('../../../utils').convertWatsonDataToArr;
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

router.get('/', authenticator.ensureAuthenticated, function(req, res, next){
  res.sendStatus(200);
})

router.post('/', /*authenticator.ensureAuthenticated,*/ function(req, res, next){
  let joyArr;
  let angerArr;
  let fearArr;
  analyzeEmotion(req.body.entry)
  .then(results => {
    console.log('here are the results', results);
    let resultArr = convertWatsonDataToArr(results[0]);
    joyArr = resultArr[2];
    angerArr = resultArr[0];
    fearArr = resultArr[1];
    return Entry.create({
      subject: req.body.subject,
      body: req.body.entry,
      joy: joyArr,
      anger: angerArr,
      fear: fearArr,
      keywords: results[1]
    });
  })
  .then(savedEntry => {
    // this is where we would set the author
    res.send(savedEntry);
  })
  .catch(next);

  
  // Entry.create(req.body)
  // .then(function(savedEntry){
  //   return savedEntry.setAuthor(req.user.id)
  // }).then(function(){
  //     res.sendStatus(201);
  // })

})

router.put('/:id', authenticator.ensureAuthenticated, function(req, res, next){
  res.sendStatus(200);
})

router.delete('/:id', authenticator.ensureAuthenticated,
              function(req, res, next){
  res.sendStatus(200);
})

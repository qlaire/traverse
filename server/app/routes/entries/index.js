'use strict';
var router = require('express').Router();
var analyzeEmotion = require('../../../utils').analyzeEmotion;
var convertWatsonDataToArr = require('../../../utils').convertWatsonDataToArr;
var authenticator = require('../utils');
var db = require('../../../db/_db');
var Entry = db.model('entry');
module.exports = router;

router.get('/', authenticator.ensureAuthenticated, function(req, res, next){
  Entry.findAll({where: {authorId: req.user.id}})
  .then(function(entries){
    res.status(200).send(entries);
  })
})

// authentication check commented out for testing purposes.
// need to add this back in.
router.post('/', /*authenticator.ensureAuthenticated,*/ function(req, res, next){
  let joyArr;
  let angerArr;
  let fearArr;
  analyzeEmotion(req.body.entry)
  .spread((emoResults, keywordResults) => {
    let resultArr = convertWatsonDataToArr(emoResults);
    joyArr = resultArr[2];
    angerArr = resultArr[0];
    fearArr = resultArr[1];
    return Entry.create({
      subject: req.body.subject,
      body: req.body.entry,
      joy: joyArr,
      anger: angerArr,
      fear: fearArr,
      keywords: keywordResults
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
  var status = 401;

  Entry.findById(req.params.id)
  .then(function(entry){
    if(entry.authorId === req.user.id){
      status = 200;
      return Entry.update(req.body, { where: {id: req.params.id}})
    }
  }).then(function(){
    res.sendStatus(status);
  }).next;

})

router.delete('/:id', authenticator.ensureAuthenticated,
              function(req, res, next){
  if(!req.user.isAdmin){
    res.sendStatus(401);
  }
  else{
    res.sendStatus(200);
  }
})

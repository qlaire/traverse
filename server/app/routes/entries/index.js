'use strict';
var router = require('express').Router();
var analyzeEmotion = require('../../../utils').analyzeEmotion;
var convertWatsonDataToArr = require('../../../utils').convertWatsonDataToArr;
var authenticator = require('../utils');
var striptags = require('striptags');
var db = require('../../../db/_db');
var Entry = db.model('entry');
module.exports = router;

router.get('/', authenticator.ensureAuthenticated, function(req, res, next){
  Entry.findAll({where: {authorId: req.user.id},
                order: [['date', 'DESC']]
              })
  .then(function(entries){
    res.status(200).send(entries);
  }).catch(next);
})

router.get('/:id', authenticator.ensureAuthenticated, function(req, res, next){
  Entry.findById(req.params.id)
  .then(function(entry){
    res.status(200).send(entry);
  }).catch(next);
})

router.post('/', authenticator.ensureAuthenticated, function(req, res, next){
  let joyArr;
  let angerArr;
  let fearArr;
  let strippedEntry = striptags(req.body.entry);
  analyzeEmotion(strippedEntry)
  .spread((emoResults, keywordResults) => {
    let resultArr = convertWatsonDataToArr(emoResults);
    joyArr = resultArr[2];
    angerArr = resultArr[0];
    fearArr = resultArr[1];
    return Entry.create({
      title: req.body.title,
      body: req.body.entry,
      joy: joyArr,
      anger: angerArr,
      fear: fearArr,
      keywords: keywordResults,
      analyzed: true
    });
  })
  .then(savedEntry => {
    return savedEntry.setAuthor(req.user.id)
  }).then(function(entry){
    res.status(201).send(entry);
  })
  .catch(err => {
    console.error("wow, looks like an error", err);
    return Entry.create({
      title: req.body.title,
      body: req.body.entry,
      analyzed: false
    });
  })
  .then(savedEntry => {
    console.log('here is the entry', savedEntry);
    return savedEntry.setAuthor(req.user.id);
  })
  .then(entry => {
    res.status(201).send(entry);
  })
  .catch(next);
})

router.put('/:id', authenticator.ensureAuthenticated, function(req, res, next){
  var status = 401;
  let joyArr;
  let angerArr;
  let fearArr;

  analyzeEmotion(req.body.entry)
    .spread((emoResults, keywordResults) => {
      let resultArr = convertWatsonDataToArr(emoResults);
      joyArr = resultArr[2];
      angerArr = resultArr[0];
      fearArr = resultArr[1];
      return Entry.update({
        body: req.body.entry || 'not really updated',
        joy: joyArr,
        anger: angerArr,
        fear: fearArr,
        keywords: keywordResults
      }, {where: {id: req.params.id, authorId: req.user.id}})
    }).then(function(result){
    if(result[0] === 1){
      status = 200;
    }
    res.sendStatus(status);
  }).then(null, next);
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

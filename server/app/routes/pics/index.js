'use strict';
var router = require('express').Router();
var authenticator = require('../utils');
var db = require('../../../db/_db');
var Pic = db.model('pic');
module.exports = router;

router.get('/', authenticator.ensureAuthenticated, function(req, res, next){
  Pic.findAll({where: {authorId: req.user.id},
                order: [['date', 'DESC']]
              })
  .then(function(pics){
    res.status(200).send(pics);
  }).catch(next);
})

router.get('/:id', authenticator.ensureAuthenticated, function(req, res, next){
  Pic.findById(req.params.id)
  .then(function(pic){
    res.status(200).send(pic);
  }).catch(next);
})

router.post('/', authenticator.ensureAuthenticated, function(req, res, next){
    return Pic.create(req.body)
  .then(savedPic => {
    return savedPic.setAuthor(req.user.id)
  }).then(function(pic){
    res.status(201).send(pic);
  })
  .then(null, next);
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

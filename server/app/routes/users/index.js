'use strict';

var router = require('express').Router();
var User = require('../../../db/models/user');
var Entry = require('../../../db/models/entry');
var authenticator = require('../utils');
var striptags = require('striptags');


var _ = require('lodash');
module.exports = router;


router.get('/', function(req, res, next) {
    User.findAll({})
    .then(function(users) {
        res.json(users);
    }).catch(next)
});

router.get('/data', authenticator.ensureAuthenticated, function(req, res, next){
  Entry.findAll({where: {authorId: req.user.id},
                order: [['date', 'ASC']]
              })
  .then(function(entries){
    //initialize world data
    var worldData={};
    worldData.dates=[];
    worldData.keywords=[];
    //initialize  helper objects
    var emotionArrays={anger: [], fear: [], joy: []};
    var intenseEntryIds={sadness:null,joy:null,anger:null,fear:null};
    var intensityExtremes={joy:-1,sadness:2,anger:-1,fear:-1};
    var emotionChunkIndices={joy:-1,fear:-1,sadness:-1,anger:-1}
    var emotion;
    var joyAvg;
    var minJoy=Infinity;
    for(var i=0; i<entries.length; i++){
      for(var j=0; j<entries[i].joy.length; j++){
        worldData.dates.push(entries[i].date);
      }
      //check if <emotion>est entry
      var emotions=Object.keys(emotionArrays);
      for(j=0; j<emotions.length; j++){
        emotion=emotions[j];
        var emotionAvg=avg(entries[i][emotion]);
        if(emotionAvg>intensityExtremes[emotion]){
          intensityExtremes[emotion]=emotionAvg;
          intenseEntryIds[emotion]=entries[i].id;
          console.log('intense: ')
          console.log(intenseEntryIds);

          emotionChunkIndices[emotion]=findChunkIndex(emotionArrays[emotion],entries[i][emotion])
        }
      }
      joyAvg=avg(entries[i].joy);
      if(avg(entries[i].joy)<minJoy){
        minJoy=joyAvg;
        intenseEntryIds.sadness=entries[i].id;
        emotionChunkIndices.sadness=findChunkIndex(emotionArrays.joy,entries[i].joy,true);
      }
      for(j=0; j<Object.keys(emotionArrays).length; j++){
        emotion=Object.keys(emotionArrays)[j];
        emotionArrays[emotion]=emotionArrays[emotion].concat(entries[i][emotion]);
      }
    }
    emotions=Object.keys(intenseEntryIds);
    var promises=[]
    for(i=0; i<emotions.length; i++){
      emotion=emotions[i];
      promises.push(Entry.findById(intenseEntryIds[emotion]))
    }
    Promise.all(promises)
    .then(function(resultArr){
      console.log(resultArr);
      worldData.emoScores=[emotionArrays.anger,emotionArrays.joy,emotionArrays.fear];
      worldData.intenseEntries={};
      console.log('chunks');
      console.log(emotionChunkIndices);

      worldData.intenseEntries.joy={body:  striptags(resultArr[1].body), chunkIndex: emotionChunkIndices.joy};
      console.log('set first')
      worldData.intenseEntries.sadness={body: striptags(resultArr[0].body), chunkIndex: emotionChunkIndices.sadness};
          console.log('set second')

      worldData.intenseEntries.anger={body:  striptags(resultArr[2].body), chunkIndex: emotionChunkIndices.anger};
      worldData.intenseEntries.fear={body:  striptags(resultArr[3].body), chunkIndex: emotionChunkIndices.fear};
      console.log('about to send');
      res.status(200).send(worldData);     
    })

  }).catch(next);
})

function findChunkIndex(largeArr,smallArr,isNegative){
  if(isNegative){
    return largeArr.length+minIndex(smallArr);
  }
  return largeArr.length+maxIndex(smallArr);
}

function maxIndex(smallArr){
  var currMax=-1;
  var currMaxIndex=-1;
  for(var i=0; i<smallArr.length; i++){
    if(smallArr[i]>currMax){
      currMax=smallArr[i];
      currMaxIndex=i;
    }
  }
  return currMaxIndex;
}

function minIndex(smallArr){
  var currMin=Infinity;
  var currMinIndex=Infinity;
  for(var i=0; i<smallArr.length; i++){
    if(smallArr[i]<currMin){
      currMin=smallArr[i];
      currMinIndex=i;
    }
  }
  return currMinIndex;
}

function getChunkIndex(arr){
  var chunkIndex=arr.length-2;
  if(chunkIndex<0){
    chunkIndex=arr.length-1;
  }
  return chunkIndex;
}

function avg(arr){
  var sum=0;
  arr.forEach(function(elt){
    sum+=elt;
  })
  return sum/arr.length;
}

router.get('/:id', function(req, res, next) {
    User.findById(req.params.id)
    .then(function(user) {
        res.send(user);
    }).catch(next)
});

router.post('/', function(req, res, next) {
	 User.create(req.body)
   .then(function(user) {
		    res.status(201).json(user);
    })
   .catch(next).catch(next)
});

router.put('/:id', function(req, res, next) {
  User.findById(req.params.id)
  .then(function(user) {
    return user.update(req.body)
  })
  .then(function() {
    return User.findById(req.params.id)
  })
  .then(function(updatedUser) {
    res.send(updatedUser);
  })
  .catch(next).catch(next)
});



var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).end();
    }
};


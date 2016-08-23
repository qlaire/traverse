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
    gatherEntryData(emotionArrays,intenseEntryIds,entries,emotionChunkIndices,intensityExtremes,worldData);
    var promises=makePromises(intenseEntryIds);
    Promise.all(promises)
    .then(function(resultArr){
      resolveWorldData(worldData,resultArr,emotionArrays,emotionChunkIndices);
      res.status(200).send(worldData);     
    })

  }).catch(next);
})

function resolveWorldData(worldData,resultArr,emotionArrays,emotionChunkIndices){
    worldData.emoScores=[emotionArrays.anger,emotionArrays.joy,emotionArrays.fear];
    worldData.intenseEntries={};
    worldData.intenseEntries.joy={body:  striptags(resultArr[1].body), chunkIndex: emotionChunkIndices.joy};
    worldData.intenseEntries.sadness={body: striptags(resultArr[0].body), chunkIndex: emotionChunkIndices.sadness};
    worldData.intenseEntries.anger={body:  striptags(resultArr[2].body), chunkIndex: emotionChunkIndices.anger};
    worldData.intenseEntries.fear={body:  striptags(resultArr[3].body), chunkIndex: emotionChunkIndices.fear};
}
function makePromises(intenseEntryIds){
    var emotions=Object.keys(intenseEntryIds);
    var promises=[]
    for(var i=0; i<emotions.length; i++){
      var emotion=emotions[i];
      promises.push(Entry.findById(intenseEntryIds[emotion]))
    }
    return promises;
}
function gatherEntryData(emotionArrays,intenseEntryIds,entries,emotionChunkIndices,intensityExtremes,worldData){
    var minJoy=Infinity;
    for(var i=0; i<entries.length; i++){
      aggregateDates(entries,i,worldData);
      minJoy=checkIfMostIntenseEntry(emotionArrays,intenseEntryIds,entries,i,emotionChunkIndices,intensityExtremes,minJoy);
      buildEmotionArrays(emotionArrays,entries,i);
      worldData.keywords=worldData.keywords.concat(entries[i].keywords);
    }
}
function buildEmotionArrays(emotionArrays,entries,i){
  for(var j=0; j<Object.keys(emotionArrays).length; j++){
    var emotion=Object.keys(emotionArrays)[j];
    emotionArrays[emotion]=emotionArrays[emotion].concat(entries[i][emotion]);
  }
}
function aggregateDates(entries,i,worldData){
    for(var j=0; j<entries[i].joy.length; j++){
      worldData.dates.push(entries[i].date);
    }  
}
function checkIfMostIntenseEntry(emotionArrays,intenseEntryIds,entries,i,emotionChunkIndices,intensityExtremes,minJoy){
      //for convenience, returns minJoy, since that is not included in the intensityExtremes object like the others
      var emotions=Object.keys(emotionArrays);
      for(var j=0; j<emotions.length; j++){
        var emotion=emotions[j];
        var emotionAvg=avg(entries[i][emotion]);
        if(emotionAvg>intensityExtremes[emotion]){
          intensityExtremes[emotion]=emotionAvg;
          intenseEntryIds[emotion]=entries[i].id;
          emotionChunkIndices[emotion]=findChunkIndex(emotionArrays[emotion],entries[i][emotion])
        }
      }
      var joyAvg=avg(entries[i].joy);
      if(avg(entries[i].joy)<minJoy){
        minJoy=joyAvg;
        intenseEntryIds.sadness=entries[i].id;
        emotionChunkIndices.sadness=findChunkIndex(emotionArrays.joy,entries[i].joy,true);
      }
      return minJoy;
}
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


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
    var worldData={};
    worldData.keywords=[];
    var angerArray=[];
    var joyArray=[];
    var fearArray=[];
    //consolidate all this into objects!!!
    var sadEntryId, joyEntryId, angryEntryId, fearEntryId;
    var angerAvg,fearAvg,joyAvg;
    var maxJoy =  -1;
    var minJoy = 2;
    var maxAnger = -1;
    var maxFear=-1;
    var joyChunkIndex=-1;
    var fearChunkIndex=-1;
    var sadnessChunkIndex=-1;
    var angerChunkIndex=-1;
    worldData.dates=[];
    // var currChunkIndex;
    for(var i=0; i<entries.length; i++){
      for(var j=0; j<entries[i].joy.length; j++){
        worldData.dates.push(entries[i].date);
      }
      // currChunkIndex=getChunkIndex(entries[i].anger);

      //check if <emotion>est entry
      angerAvg=avg(entries[i].anger);
      if(avg(entries[i].anger)>maxAnger){
        maxAnger=angerAvg;
        angryEntryId=entries[i].id;
        angerChunkIndex=findChunkIndex(angerArray,entries[i].anger);
      }
      fearAvg=avg(entries[i].fear);
      if(avg(entries[i].fear)>maxFear){
        maxFear=fearAvg;
        fearEntryId=entries[i].id;
        fearChunkIndex=findChunkIndex(fearArray,entries[i].fear);
      }
      joyAvg=avg(entries[i].joy);
      if(avg(entries[i].joy)>maxJoy){
        maxJoy=joyAvg;
        joyEntryId=entries[i].id;
        joyChunkIndex=findChunkIndex(joyArray,entries[i].joy);
      }
      if(avg(entries[i].joy)<minJoy){
        minJoy=joyAvg;
        sadEntryId=entries[i].id;
        sadnessChunkIndex=findChunkIndex(joyArray,entries[i].joy,true);
      }
      angerArray=angerArray.concat(entries[i].anger);
      joyArray=joyArray.concat(entries[i].joy);
      fearArray=fearArray.concat(entries[i].fear);
      console.log('keywords for entry '+i+': ',entries[i].keywords)
      worldData.keywords=worldData.keywords.concat(entries[i].keywords);

      console.log(angerAvg,fearAvg,joyAvg)
      console.log(sadEntryId,joyEntryId,angryEntryId,fearEntryId);
    }
    var sadEntryPromise=Entry.findById(sadEntryId);
    var joyEntryPromise=Entry.findById(joyEntryId);
    var angryEntryPromise=Entry.findById(angryEntryId);
    var fearEntryPromise=Entry.findById(fearEntryId);
    Promise.all([sadEntryPromise,joyEntryPromise,angryEntryPromise,fearEntryPromise])
    .then(function(resultArr){
      worldData.emoScores=[angerArray,joyArray,fearArray];
      worldData.intenseEntries={};

      worldData.intenseEntries.sadness={body: striptags(resultArr[0].body), chunkIndex: sadnessChunkIndex}
      worldData.intenseEntries.joy={body:  striptags(resultArr[1].body), chunkIndex: joyChunkIndex}
      worldData.intenseEntries.anger={body:  striptags(resultArr[2].body), chunkIndex: angerChunkIndex}
      worldData.intenseEntries.fear={body:  striptags(resultArr[3].body), chunkIndex: fearChunkIndex}

      // worldData.intenseEntries.sadness={body: resultArr[0].body, chunkIndex: sadnessChunkIndex}
      // worldData.intenseEntries.joy={body: resultArr[1].body, chunkIndex: joyChunkIndex}
      // worldData.intenseEntries.anger={body: resultArr[2].body, chunkIndex: angerChunkIndex}
      // worldData.intenseEntries.fear={body: resultArr[3].body, chunkIndex: fearChunkIndex}
      console.log(worldData);
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

router.get('/secret-stash', ensureAuthenticated, function(req, res) {
    var theStash = [
      'http://ep.yimg.com/ay/candy-crate/bulk-candy-store-2.gif',
      'http://www.dailybunny.com/.a/6a00d8341bfd0953ef0148c793026c970c-pi',
      'http://images.boomsbeat.com/data/images/full/44019/puppy-wink_1-jpg.jpg',
      'http://p-fst1.pixstatic.com/51071384dbd0cb50dc00616b._w.540_h.610_s.fit_.jpg',
      'http://childcarecenter.us/static/images/providers/2/89732/logo-sunshine.png',
      'http://www.allgraphics123.com/ag/01/10683/10683.jpg',
      'http://img.pandawhale.com/post-23576-aflac-dancing-duck-pigeons-vic-RU0j.gif',
      'http://www.eveningnews24.co.uk/polopoly_fs/1.1960527.1362056030!/image/1301571176.jpg_gen/derivatives/landscape_630/1301571176.jpg',
      'http://media.giphy.com/media/vCKC987OpQAco/giphy.gif',
      'https://my.vetmatrixbase.com/clients/12679/images/cats-animals-grass-kittens--800x960.jpg',
      'http://www.dailymobile.net/wp-content/uploads/2014/10/lollipops.jpg'
    ];
    res.send(_.shuffle(theStash));
});

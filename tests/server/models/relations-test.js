'use strict';
var db = require('../../../server/db/_db');
var expect = require('chai').expect;
var Entry = require('../../../server/db/models/entry');
var User = require('../../../server/db/models/user');

describe('Relations',function(){
  var obamaEntries, zekeEntries, userObama, userZeke;

  beforeEach(function () {
    return db.sync({force: true});
  });

  beforeEach(function (done) {
      obamaEntries = [];
      zekeEntries = [];
      userObama = User.create({ email: 'obama@gmail.com', password: 'potus' });

      userZeke = User.create({ email: 'zeke@zeke.zeke', password: 'zeke' });

      //Actually creating userZeke, userObama and creating arrays with entries in them

        userZeke
        .then(function(res){
          userZeke = res;
          return userObama;
        }).then(function(res){
          userObama = res;
          return Entry.create({
          body: 'Migratory Birds',
          joy: [1],
          fear: [2],
          anger: [3]})
      }).then(function (savedEntry) {
        obamaEntries.push(savedEntry);
        return Entry.create({
        body: 'number2',
        joy: [0.2],
        fear: [0.4],
        anger: [0.6]})
      }).then(function (savedEntry) {
        obamaEntries.push(savedEntry);
        return Entry.create({
        body: 'number3',
        joy: [0.3],
        fear: [0.6],
        anger: [0.9]})
      }).then(function (savedEntry) {
        zekeEntries.push(savedEntry);
        return Entry.create({
        body: 'number4',
        joy: [0.4],
        fear: [0.8],
        anger: [0.12]})
      }).then(function (savedEntry) {
        zekeEntries.push(savedEntry);
        done();
      })
    })

    describe('User',function(){

      it('has many entries',function(done){
        return userObama.addEntries(obamaEntries)
        .then(function(user){
          return user.getEntries();
        })
        .then(function(entries){
          expect(entries).to.be.lengthOf(2);
          expect(entries[0].body).to.contain(obamaEntries[0].body);
          expect(entries[1].body).to.contain(obamaEntries[1].body);
          done();
        })
      })
    })

    describe('Entry',function (){

    it('belongs To User',function (done){
        return zekeEntries[0].setAuthor(userZeke)
        .then(function(entry){
          return entry.getAuthor()})
        .then(function(author){
          expect(author.email).to.equal(userZeke.email);
          done();
        })
      })
    })
  })

'use strict';

var expect = require('chai').expect;
var Entry = require('../../../server/db/models/entry');
var db = require('../../../server/db/_db');


xdescribe('Entry Model', function () {

  before(function () {
    return db.sync({force: true});
  });
  describe('Entry Body', function () {

    it('has a body', function () {
      return Entry.create({
        body: 'Migratory Birds',
        joy: [],
        fear: [],
        anger: [],
        keywords: 'apple'
      }).then(function (savedEntry) {
        expect(savedEntry.body).to.equal('Migratory Birds');
      });
    });

    it('requires body', function () {
      var entry = Entry.build({
      });

      return entry.validate()
        .then(function(result) {
          expect(result).to.be.an.instanceOf(Error);
          expect(result.message).to.contain('notNull');
        });
    });

    it('body cannot be empty', function () {

      var entry = Entry.build({
        body: '',
        joy: [],
        fear: [],
        anger: [],
        keywords: 'apple'
      });

      return entry.validate()
        .then(function (result) {
          expect(result).to.be.an.instanceOf(Error);
          expect(result.message).to.contain('Validation error');
        });
    });
  })

  describe('Entry Subject', function () {

      it('has a subject', function () {
      return Entry.create({
        subject: 'Test',
        body: 'Migratory Birds',
        joy: [],
        fear: [],
        anger: [],
        keywords: 'apple'
      }).then(function (savedEntry) {
        expect(savedEntry.subject).to.equal('Test');
      });
    });
  })

  describe('Entry Date', function () {
    it('has a date', function () {
      return Entry.create({
        subject: 'Test',
        body: 'Migratory Birds',
        joy: [],
        fear: [],
        anger: [],
        keywords: 'apple'
      }).then(function (savedEntry) {
        expect(savedEntry.date + '').to.equal(new Date() + '');
      });
    });
  })

  describe('Entry Arrays', function () {
    it('has a joy array', function () {
      return Entry.create({
        body: 'Migratory Birds',
        joy: [5],
        fear: [],
        anger: [],
        keywords: 'apple'
      }).then(function (savedEntry) {
        expect(savedEntry.joy).is.an('array');
        expect(savedEntry.joy[0]).to.equal(5);
      });
    });

    it('requires a joy array', function () {
      return Entry.create({
        body: 'Migratory Birds',
        fear: [],
        anger: [],
        keywords: 'apple'
      }).then(function(response){
        expect(response).to.be.an.instanceOf(Error);
        expect(response.message).to.contain('notNull');
      })
      .catch(function (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.contain('notNull');
      });
    });

    it('has a fear array', function () {
      return Entry.create({
        body: 'Migratory Birds',
        joy: [],
        fear: [11],
        anger: [],
        keywords: 'apple'
      }).then(function (savedEntry) {
        expect(savedEntry.fear).is.an('array');
        expect(savedEntry.fear[0]).to.equal(11);
      });
    });

    it('requires a fear array', function () {
      return Entry.create({
        body: 'Migratory Birds',
        joy: [],
        anger: [],
        keywords: 'apple'
      }).then(function(response){
        expect(response).to.be.an.instanceOf(Error);
        expect(response.message).to.contain('notNull');
      })
      .catch(function (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.contain('notNull');
      });
    });

    it('has an anger array', function () {
      return Entry.create({
        body: 'Migratory Birds',
        joy: [],
        fear: [],
        anger: [6],
        keywords: 'apple'
      }).then(function (savedEntry) {
        expect(savedEntry.anger).is.an('array');
        expect(savedEntry.anger[0]).to.equal(6);
      });
    });

    it('requires an anger array', function () {
      return Entry.create({
        body: 'Migratory Birds',
        joy: [],
        fear: [],
        keywords: 'apple'
      }).then(function(response){
        expect(response).to.be.an.instanceOf(Error);
        expect(response.message).to.contain('notNull');
      })
      .catch(function (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.contain('notNull');
      });
    });

  })
});

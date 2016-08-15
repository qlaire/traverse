'use strict';

var expect = require('chai').expect;
var Entry = require('../../../server/db/models/entry');
var db = require('../../../server/db/_db');


describe('Entry Model', function () {

  /**
   * First we clear the database and recreate the tables before beginning each run
   */
  before(function () {
    return db.sync({force: true});
  });

  it('has body', function () {
    return Entry.create({
      body: 'Migratory Birds',
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
    });

    return entry.validate()
      .then(function (result) {
        expect(result).to.be.an.instanceOf(Error);
        expect(result.message).to.contain('Validation error');
      });
  });
});

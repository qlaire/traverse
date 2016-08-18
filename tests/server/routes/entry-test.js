var expect = require('chai').expect;

var db = require('../../../server/db');

var supertest = require('supertest');

describe('Entries Route', function() {
  var app, User, Entry, entryArr;

  beforeEach('Sync DB', function() {
      return db.sync({
          force: true
      });
  });

  beforeEach('Create app', function() {
      app = require('../../../server/app')(db);
      User = db.model('user');
      Entry = db.model('entry');
      entryArr = [];
  })

  beforeEach('Seed category database', function() {
    Entry.create({
          body: 'banana',
          joy: [],
          anger:[],
          fear: [],
          keywords: 'apple'
      })
      .then(function(entry) {
          entryArr.push(entry);
          return Entry.create({
              body: 'apple',
          joy: [],
          anger:[],
          fear: [],
          keywords: 'apple'
          })
      })
      .then(function(entry) {
          entryArr.push(entry);
          return Entry.create({
              body: 'pie',
          joy: [],
          anger:[],
          fear: [],
          keywords: 'apple'
          })
      })
      .then(function(entry) {
          entryArr.push(entry);
      })
    });
  describe('Unauthenticated user request', function() {

    var guestAgent;

    beforeEach('Create guest agent', function() {
        guestAgent = supertest.agent(app);

    });

    it('try to access entries page should get a 401 error', function(done) {
        guestAgent.get('/api/entries')
          .expect(401)
          .end(function(err, res) {
              if (err) return done(err);

              Entry.findAll({
                order: [['id', 'ASC']]
              })
              .then(function(arr) {
                expect(arr).to.be.an('array');
                expect(arr).to.have.lengthOf(3);
                expect(arr[0].body).to.contain(entryArr[0].body);
                expect(arr[1].body).to.contain(entryArr[1].body);
                expect(arr[2].body).to.contain(entryArr[2].body);
              }).catch(function(error){
                done(error);
              })
              done();
          });
    });

    it('try to add an entry should get a 401 error', function(done) {
        guestAgent.post('/api/entries').send({body: 'cheese', joy: [], anger:[],
                                             fear: []})
          .expect(401)
          .end(function(err, res) {
              if (err) return done(err);

              Entry.findAll({
                order: [['id', 'ASC']]
              })
              .then(function(arr) {
                expect(arr).to.be.an('array');
                expect(arr).to.have.lengthOf(3);
                expect(arr[0].body).to.contain(entryArr[0].body);
                expect(arr[1].body).to.contain(entryArr[1].body);
                expect(arr[2].body).to.contain(entryArr[2].body);
              }).catch(function(error){
                done(error);
              })
              done();
          });
    });

    it('try to update an entry should get a 401 error', function(done) {
        guestAgent.put('/api/entries/1').send({body: 'cheese', joy: [], anger:[],
                                             fear: []})
          .expect(401)
          .end(function(err, res) {
              if (err) return done(err);

              Entry.findAll({
                order: [['id', 'ASC']]
              })
              .then(function(arr) {
                expect(arr).to.be.an('array');
                expect(arr).to.have.lengthOf(3);
                expect(arr[0].body).to.contain(entryArr[0].body);
                expect(arr[1].body).to.contain(entryArr[1].body);
                expect(arr[2].body).to.contain(entryArr[2].body);
              }).catch(function(error){
                done(error);
              })
              done();
            });
    });

    it('try to delete an entry should get a 401 error', function(done) {
        guestAgent.delete('/api/entries/1')
          .expect(401)
          .end(function(err, res) {
              if (err) return done(err);

              Entry.findAll({
                order: [['id', 'ASC']]
              })
              .then(function(arr) {
                expect(arr).to.be.an('array');
                expect(arr).to.have.lengthOf(3);
                expect(arr[0].body).to.contain(entryArr[0].body);
                expect(arr[1].body).to.contain(entryArr[1].body);
                expect(arr[2].body).to.contain(entryArr[2].body);
                }).catch(function(error){
                done(error);
              })
              done();
          });
    });
  });

  describe('Authenticated request', function () {

    var loggedInAgent;

    var userInfo= {
        email: 'joe@gmail.com',
        password: 'shoopdawoop',
      };

    var user2= {
        email: 'obama@gmail.com',
        password: 'potus',
      };

      beforeEach('Create a user', function (done) {
        return User.create(userInfo).then(function(){
                return User.create(user2);
              }).then(function(user) {
                return entryArr[0].setAuthor(2)
              }).then(function(){
                entryArr[1].setAuthor(1);
                done();
              }).catch(done)
      });

      beforeEach('Create loggedIn user agent and authenticate', function (done) {
        loggedInAgent = supertest.agent(app);
        loggedInAgent.post('/login').send(user2).end(done);
      });

      it('should get with 200 response and with an array as the body containing'
         + ' banana' , function (done) {
        loggedInAgent.get('/api/entries')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);

            Entry.findAll({where: {authorId: 2},
                order: [['id', 'ASC']]
              })
              .then(function(arr) {
                expect(arr).to.be.an('array');
                expect(arr).to.have.lengthOf(1);
                expect(arr[0].body).to.contain(entryArr[0].body);
              }).catch(function(error){
                done(error);
              })
              done();
          });
      });

      it('Try to add an entry', function (done){
        loggedInAgent.post('/api/entries/').send({entry: 'cheese. it is yummy. bananas. i like things. Every act of cheese is an act of sadness. why dost thou cry little one?'})
        .expect(201)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.be.empty;

            Entry.findAll({
                order: [['id', 'ASC']]
              })
          .then(function(arr){
            expect(arr).to.be.an('array');
            expect(arr).to.have.lengthOf(4);
            expect(arr[0].body).to.contain(entryArr[0].body);
            expect(arr[1].body).to.contain(entryArr[1].body);
            expect(arr[2].body).to.contain(entryArr[2].body);
            expect(arr[3].body).to.contain('cheese');
            expect(arr[3].authorId).to.equal(2);
          }).catch(function(error){
            done(error);
          })
        })
          done();
      });

    it('Try to edit own entry get 200', function (done){
        loggedInAgent.put('/api/entries/1').send({entry: 'purple. I love purple. It is the best of colors. I enjoy it ever so much. I hate dogs though. Dogs are terrible. I love purple.'})
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.be.empty;

          Entry.findAll({
                order: [['id', 'ASC']]
              })
          .then(function(arr){
            expect(arr).to.be.an('array');
            expect(arr).to.have.lengthOf(3);
            expect(arr[0].body).to.contain('purple');
            expect(arr[1].body).to.contain(entryArr[1].body);
            expect(arr[2].body).to.contain(entryArr[2].body);
            }).catch(function(error){
              done(error);
            })
          })
        done();
      });

        it('Try to edit someone else\'s entry get 401', function (done){
        loggedInAgent.put('/api/entries/2').send({body: 'sleep'})
        .expect(401)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.be.empty;

          Entry.findAll({
                order: [['id', 'ASC']]
              })
          .then(function(arr){
            expect(arr).to.be.an('array');
            expect(arr).to.have.lengthOf(3);
            expect(arr[0].body).to.contain(entryArr[0].body);
            expect(arr[1].body).to.contain(entryArr[1].body);
            expect(arr[2].body).to.contain(entryArr[2].body);
            }).catch(function(error){
                done(error);
            })
            done();
          });
      });

    it('Try to delete a entry and get a 401 error', function (done){
        loggedInAgent.delete('/api/entries/1')
        .expect(401)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.be.empty;

          Entry.findAll({
                order: [['id', 'ASC']]
              })
          .then(function(arr){
            expect(arr).to.be.an('array');
            expect(arr).to.have.lengthOf(3);
            expect(arr[0].body).to.contain(entryArr[0].body);
            expect(arr[1].body).to.contain(entryArr[1].body);
            expect(arr[2].body).to.contain(entryArr[2].body);
          }).catch(function(error){
                done(error);
          })
          done();
          });
    });
  });
});

  //   describe('Admin request', function(){
  //     var adminAgent;

  //       var admin = {
  //       email: 'emily@e.com',
  //       password: 'lucas',
  //       isAdmin: true,
  //       name: 'Emily'
  //     };

  //     beforeEach('Create an admin', function (done){
  //         return User.create(admin).then(function () {
  //           done()
  //       }).catch(done);
  //     });

  //     beforeEach('Create adminAgent admin and authenticate', function (done) {
  //       adminAgent = supertest.agent(app);
  //       adminAgent.post('/login').send(admin).end(done);
  //     });

  //     it('should get with 200 response and with an array as the body containing'
  //        + ' banana, apple, pie' , function (done) {
  //       adminAgent.get('/api/categories')
  //       .expect(200)
  //       .end(function(err, res){
  //         if(err) return done(err);

  //           var arr = usefulArr(res.body);

  //           expect(arr).to.be.an('array');
  //           expect(arr).to.have.lengthOf(3);
  //           expect(arr).to.contain(catArr[0]);
  //           expect(arr).to.contain(catArr[1]);
  //           expect(arr).to.contain(catArr[2]);
  //           done();
  //         });
  //     });

  //     it('Successfully Add a category', function (done){
  //       adminAgent.post('/api/categories').send({name: 'pizza'})
  //       .expect(201)
  //       .end(function(err, res){
  //         if(err) return done(err);
  //         expect(res.body.name).to.equal('pizza');
  //         catArr.push({id: 4, name: 'pizza'});

  //         getAll(Category)
  //         .then(function(arr){
  //           expect(arr).to.be.an('array');
  //           expect(arr).to.have.lengthOf(4);
  //           expect(arr[0]).to.eql(catArr[0]);
  //           expect(arr[1]).to.eql(catArr[1]);
  //           expect(arr[2]).to.eql(catArr[2]);
  //           expect(arr[3]).to.eql(catArr[3]);
  //         })
  //        .catch(err);
  //         done();
  //       });
  //     });

  //   it('edit a category and get a 200 message', function (done){
  //       adminAgent.put('/api/categories/1').send({name: 'cheese'})
  //       .expect(201)
  //       .end(function(err, res){
  //         if(err) return done(err);
  //         expect(res.body.name).to.be.empty;
  //         catArr[0] = {id: 1, name: 'cheese'};

  //         getAll(Category)
  //         .then(function(arr){
  //           expect(arr).to.be.an('array');
  //           expect(arr).to.have.lengthOf(3);
  //           expect(arr[0]).to.eql(catArr[0]);
  //           expect(arr[1]).to.eql(catArr[1]);
  //           expect(arr[2]).to.eql(catArr[2]);
  //           })
  //         .catch(err);
  //         done();
  //       })
  //     });

  //   it('delete a category and get a 200 message', function (done){
  //       adminAgent.delete('/api/categories/3')
  //       .expect(204)
  //       .end(function(err, res){
  //         if(err) return done(err);
  //         expect(res.body.name).to.be.empty;
  //         Category.findOne({
  //           where: {
  //             name: 'pizza'
  //           }
  //         })
  //         .then(function(result){
  //           expect(result).to.eql(null);
  //         })
  //         .then(function(){
  //           getAll(Category)
  //           .then(function(arr){
  //           expect(arr).to.be.an('array');
  //           expect(arr).to.have.lengthOf(2);
  //           expect(arr[0]).to.eql(catArr[0]);
  //           expect(arr[1]).to.eql(catArr[1]);
  //           })
  //         })
  //         .catch(err);
  //         done();
  //       });
  //     });
  //   });
  // });

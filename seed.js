/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Entry = db.model('entry');
var Promise = require('sequelize').Promise;

var seedEntries = function() {
  var entries = [{
    subject: "bananas",
    body: "I love bananas a lot.",
    joy: [],
    anger: [],
    fear: [],
    keywords: [{ 'bananas': '0.1' }]
  }, {
    subject: "cheese",
    body: "I love cheese a bunch.",
    joy: [],
    anger: [],
    fear: [],
    keywords: [{ 'cheese': '0.1' }]
  }, {
    subject: "apples",
    body: "I love apples.",
    joy: [],
    anger: [],
    fear: [],
    keywords: [{ 'apples': '0.1' }]
  }, {
    subject: "sleepy",
    body: "I am very tired",
    joy: [],
    anger: [],
    fear: [],
    keywords: [{ 'sleepy': '0.1' }]
  }];

  var i = 1;
  var creatingEntries = entries.map(function(entryObj) {
    return Entry.create(entryObj).then(function(entry) {
      return entry.setAuthor(i++ % 2 + 1);
    });
  });

  return Promise.all(creatingEntries);
}

var seedUsers = function() {

  var users = [{
    email: 'testing@fsa.com',
    password: 'password'
  }, {
    email: 'obama@gmail.com',
    password: 'potus',
    isAdmin: true
  }];

  var creatingUsers = users.map(function(userObj) {
    return User.create(userObj);
  });

  return Promise.all(creatingUsers);

};

db.sync({ force: true })
  .then(function() {
    return seedUsers();
  })
  .then(function() {
    return seedEntries();
  })
  .then(function() {
    console.log(chalk.green('Seed successful!'));
    process.exit(0);
  })
  .catch(function(err) {
    console.error(err);
    process.exit(1);
  });

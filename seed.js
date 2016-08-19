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
    joy: [0.8, 0.2, 0.3],
    anger: [0.1, 0.0, 0.0],
    fear: [0.3, 0.2, 0.1],
    keywords: [{ 'bananas': '0.1' }]
  }, {
    subject: "cheese",
    body: "I love cheese a bunch.",
    joy: [0.8, 0.2, 0.3],
    anger: [0.1, 0.0, 0.0],
    fear: [0.3, 0.2, 0.1],
    keywords: [{ 'cheese': '0.1' }]
  }, {
    subject: "apples",
    body: "I love apples.",
    joy: [0.8, 0.2, 0.3],
    anger: [0.1, 0.0, 0.0],
    fear: [0.3, 0.2, 0.1],
    keywords: [{ 'apples': '0.1' }]
  }, {
    subject: "sleepy",
    body: "I am very tired",
    joy: [0.1, 0.0, 0.0],
    anger: [0.8, 0.2, 0.3],
    fear: [0.3, 0.2, 0.1],
    keywords: [{ 'sleepy': '0.1' }]
  }, {
    subject: "I'm sad",
    body: "I've been depressed since december last year, possibly longer. Before december I had about a month period where I actually felt happy for a change. Before that I just wanted to drink my sorrows away every day and the loneliness was killing me. Now, in january a relationship I was in ended. I've been depressed pretty much ever since, but my depression keeps changing in it's symptoms. For 6 months since January untill I got over her I was severely depressed due to losing a friend among other things as well and I was suicidal, self-harming at some point, etc. When I got over her, I was still depressed, somewhat midly. But then it gets worse. I've read about different kinds of depression and one week I relate completely to one type, while the next week the other. The symptoms change. Now I'm restless and fidgety. I wasn't like that last week. So, it's difficult to decide what to answer to online depression tests. Anyone else with a similar experience?",
    joy: [0.1,0,0],
    anger: [0.3,0.7,0.6],
    fear: [0.2,0.2,0.3],
    keywords: [{"loneliness":"0.9","sorrows":"0.9","period":"0.8","change":"0.7","relationship":"0.7"},{"depression":"1.0","symptoms":"0.9","friend":"0.9","things":"0.8","point":"0.8"},{"different kinds":"0.9","depression tests":"0.8","symptoms change":"0.7","similar experience":"0.7"}]
  }, {
    subject: "I'm an eagle scout",
    body: "Yesterday, I officially obtained the rank of eagle scout. It is Boy Scouting's highest rank. Only about 5% of boys who join scouting obtain the rank of eagle! I have been working towards this for that past 8 years. After a lot of hard work it feels great to have achieved such an honor. The one thing that I have stuck with for most of my life(I started as a cub scout) has become such a foundation for who I am. The process for the rank is no easy task. I had to earn several merit badges. I also had to plan and lead a service project. For my project I build a dog walking trail for a local animal shelter to walk the shelter dogs on. I just wanted to share this because it is something that finally getting has made me so happy. Also if you are a boy scout and are working towards your eagle scout, keep working for it. It is a wonderful honor. Nothing in my life has made me more happy than being told that I was officially and eagle scout.",
    joy: [0.2,0.4,0.8],
    anger: [0.3,0.3,0.3],
    fear: [0.1,0.1,0],
    keywords: [{"highest rank":"0.9","eagle scout":"0.8","Boy Scouting":"0.6","boys":"0.3"},{"merit badges":"0.9","cub scout":"0.8","hard work":"0.8","easy task":"0.8","honor":"0.5","thing":"0.5","rank":"0.5","life":"0.4","foundation":"0.4"},{"local animal shelter":"1.0","wonderful honor":"0.9","service project":"0.8","eagle scout":"0.8","boy scout":"0.7","dog":"0.4","trail":"0.4","life":"0.4"}]
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

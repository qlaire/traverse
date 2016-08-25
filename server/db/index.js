'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user');
var Entry = require('./models/entry');
var Pic = require('./models/pic');

Entry.belongsTo(User, {as: 'author', foreignKey: 'authorId'});
User.hasMany(Entry,{as: 'entries', foreignKey: 'authorId'});

Pic.belongsTo(User, {as: 'author', foreignKey: 'authorId'});
User.hasMany(Pic, {as: 'pics', foreignKey: 'authorId'});

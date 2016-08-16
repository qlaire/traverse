'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user');
var Entry = require('./models/entry');

Entry.belongsTo(User, {as: 'author', foreignKey: 'authorId'});
User.hasMany(Entry,{as: 'entries', foreignKey: 'authorId'});

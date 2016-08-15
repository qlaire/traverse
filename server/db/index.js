'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user');
var Entry = require('./models/entry');

User.hasMany(Entry, {as: 'entries'});
Entry.belongsTo(User, {as: 'author'});


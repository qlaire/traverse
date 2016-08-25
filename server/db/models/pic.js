'use strict';
var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('pic', {
  title: {
    type: Sequelize.STRING
  },
  imgUrl: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  instanceMethods: {},
  classMethods: {},
  hooks: {}
});

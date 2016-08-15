'use strict';
var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('entry', {
    subject: {
        type: Sequelize.STRING
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    joy: {
        type: Sequelize.ARRAY(Sequelize.FLOAT)
    },
    anger: {
        type: Sequelize.ARRAY(Sequelize.FLOAT)
    },
    fear: {
        type: Sequelize.ARRAY(Sequelize.FLOAT)
    }
}, {
    instanceMethods: {
    },
    classMethods: {
    },
    hooks: {
    }
});

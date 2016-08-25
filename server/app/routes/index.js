'use strict';
var router = require('express').Router();

router.use('/entries', require('./entries'));
router.use('/users', require('./users'));
router.use('/pics', require('./pics'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

module.exports = router;

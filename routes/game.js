const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('game', { title: 'Dimitree' });
});

module.exports = router;
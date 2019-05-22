const express = require('express');
const router = express.Router();
const userHandler = require('../public/javascripts/userHandler');

router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Dimitree' });
});

router.get('/register', function (req, res, next) {
    res.render('register', { title: 'Dimitree'});
});

router.post('/authLogin', function (req, res, next) {
    userHandler.login(req, res, req.body.get('Username'), req.body.get('Password'));
});

router.post('/authRegister', function (req, res, next) {
    userHandler.register(req, res, req.body.get('Username'), req.body.get('Email'), req.body.get('Email2'), req.body.get('Password'), req.body.get('Password2'));
});



module.exports = router;
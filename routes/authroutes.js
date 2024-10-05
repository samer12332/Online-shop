const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const validator = require('express-validator');
const {isAuth, notAuth} = require('./guards/auth-guard');

const {getSignUp, getLogin,
    postSignup, postLogin,
logout} = require('../controllers/auth_controller');

const urlEncoded = bodyParser.urlencoded({extended: true});

router.get('/signup', notAuth, getSignUp);

router.post('/signup', notAuth, urlEncoded, 
    validator.check('username').not().isEmpty()
    .withMessage('username is required'),
    validator.check('email').not().isEmpty()
    .withMessage('email is required').
    isEmail().withMessage('Invalid format'),
    validator.check('password').isLength({min: 6})
    .withMessage('password must be at least 6 characters'),
    validator.check('confirmPassword').custom((value, {req}) => {
        if(value == req.body.password) {
            return true;
        } else {
            throw 'passwords don\'t match';
        }
    })
, postSignup);

router.get('/login', notAuth, getLogin);

router.post('/login', notAuth,urlEncoded,
    validator.check('email').isEmail().withMessage('not valid format'),
    validator.check('password').isLength({min: 6}).withMessage('password must be at least 6 characters')
    ,postLogin);

router.all('/logout', isAuth,logout);

module.exports = router

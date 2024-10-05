const User = require('../models/auth_schema');
const bcrypt = require('bcrypt');
const validation = require('express-validator');


const getSignUp = (req, res) => {
    res.render('signup', {
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false,
        title: 'Signup'
    });
}

const getLogin = (req, res) => {
    //console.log(req.flash('authError')[0]);
    res.render('login', {authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false,
        title: 'Login'
    });
};

const postLogin = (req, res) => {
    if(validation.validationResult(req).isEmpty()) {
        User.findOne({ email: req.body.email })
        .then((user) => {
            console.log(155)
            if (!user) {
                console.log(15)
                req.flash('authError', 'There is no user matching this email')
                res.redirect('/login');
            } else {
                
                bcrypt.compare(req.body.password, user.password)
                .then((same) => {
                    if (!same) {
                        console.log(45);
                        req.flash('validationErrors', 'Password is incorrect');
                        res.render('login', {authError: req.flash('authError')[0], title: 'Login',
                            isUser: false, isAdmin: false, validationErrors: req.flash('validationErrors')});
                    } else {
                        //console.log(same);
                        req.session.userId = user._id;
                        req.session.isAdmin = user.isAdmin;
                        res.redirect('/');
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
        }).catch((error) => {
            req.flash('authError', error);
            res.render('login', {authError: req.flash('authError')[0], title: 'Login Error', isUser: false, isAdmin: false});
        })
    } else {
        req.flash('validationErrors', validation.validationResult(req).array());
        res.redirect('/login');
    }
    
}


const postSignup = (req, res) => {
    //return console.log(validation.validationResult(req).array());
    //console.log(validation.validationResult(req).array());
    if(validation.validationResult(req).isEmpty()) {
        User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                res.send('Email is already in use.');
            } else {
                bcrypt.hash(req.body.password, 10)
                    .then((hashedPassword) => {
                        const newUser = new User({
                            username: req.body.username,
                            email: req.body.email,
                            password: hashedPassword,
                        });
                        newUser.save(); 
                    })
                    .then(() => {
                        res.redirect('/login'); 
                    })
                    .catch((error) => {
                        console.log(error);
                        res.redirect('/signup');
                    });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error finding user.'); // Handle database query error
        });
    } else {
        req.flash('validationErrors', validation.validationResult(req).array())
        res.redirect('/signup');
    }
    
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}


module.exports = {
    getSignUp, 
    getLogin,
    postSignup,
    postLogin,
    logout
}







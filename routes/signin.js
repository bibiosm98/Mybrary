const express = require('express')
const router = express.Router()
const User = require('../models/user')

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

router.use(methodOverride('_method'))
router.use(express.urlencoded({extended: false}))
router.use(flash())
router.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize());
router.use(passport.session());
router.use((req, res, next) => {
    if(req.isAuthenticated()){
        res.locals.userLoggedIn = true;
    }else{
        res.locals.userLoggedIn = false;
    }
    next();
})

const inicializePassport = require('./passport-config')
inicializePassport(
    passport, 
    email => {
        let search = {};
        search.email = new RegExp(email, 'i');
        return User.findOne(search)
    },
    id => {
        let search = {};
        search.id = new RegExp(id, 'i');
        return user = User.findOne(search);
    }
)

router.get('/', checkNotAuthenticated, (req, res) => {
    if(req.isAuthenticated()){
        res.locals.userLoggedIn = true;
    }
    res.render('../views/user/signin');
})

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/signin',
        failureRedirect: '/',
        failureFlash: true
    })
)

router.delete('/', (req, res) => {
    req.logOut();
    res.locals.userLoggedIn = false;
    req.session.destroy();
    res.redirect('/'); 
})


function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/signin');
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        res.locals.userLoggedIn = true;
        req.session.user = true;
        return res.redirect('/');
    }
    return next();
}

module.exports = router;
const express = require('express')
const router = express.Router()
const User = require('../models/user')

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

router.use(express.urlencoded({extended: false}))
router.use(flash())
router.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize());
router.use(passport.session());

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

router.get('/', (req, res) => {
    res.render('../views/user/signin');
})

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/books',
        failureRedirect: '/authors',
        failureFlash: true
    }
))

router.delete('/logout', (req, res) =>{
    req.logOut();
    res.redirect('/'); 
})

module.exports = router;
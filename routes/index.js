const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const session = require('express-session');
router.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

router.get('/', async (req, res) => {
    if(req.session.user){
        res.locals.userLoggedIn = true;
    }
    let books;
    try{
        books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec();
    }catch{
        books = [];
    }
    res.render('index', {books: books});
});

module.exports = router; 
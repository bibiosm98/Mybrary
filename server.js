if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
} 

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');
const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');



const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () =>{console.log('Connected to database');});

app.set('view engine', 'ejs');
app.set('views', __dirname+ '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit: '10mb', extended:false}));
app.use('/', indexRouter);
app.use('/authors', authorRouter); 
app.use('/books', bookRouter); 
app.use('/signup', signupRouter); 
app.use('/signin', signinRouter); 


app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());



app.listen(process.env.PORT || 3000); 
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const UserError = require('../models/userError')

const bcrypt = require('bcrypt');
const session = require('express-session');
router.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

router.get('/', (req, res) => {
    chechUserLoggedIn(req, res);
    res.render('../views/user/signup', {user: new User, error: new UserError});
})

router.post('/', async (req, res) =>{  
    chechUserLoggedIn(req, res);

    let userCorrectData = true;
    const user = new User({
        name: req.body.name,
        email: req.body.email
    })
    const myError = new UserError({})

    if(req.body.name != null && req.body.name != ''){}else{
        myError.errorName = "Please type name";
        userCorrectData = false;
    }
    if(req.body.email != null && req.body.email != ''){}else{
        myError.errorEmail = "Please type email";
        userCorrectData = false;
    }
    if(req.body.password != null && 
       req.body.password != ''){}else{
        myError.errorPassword = "Please type password"
        userCorrectData = false;
    }
    if(req.body.password != req.body.repeatPassword){
        myError.errorPassword = "Passwords not equals"
        userCorrectData = false;
    }
    if(await User.findOne({email: new RegExp(req.body.email, 'i')})){
        myError.errorEmail = "Adres email already used"
        userCorrectData = false;
    }
    
    if(userCorrectData){
        try{
            user.password = await bcrypt.hash(req.body.password, 10);
            const newUser = await user.save();
            res.redirect('/')
        }catch{
            res.render('user/signup', {
                user: user, 
                error: myError
            })
        }
    }else{
        res.render('user/signup', {
            user: user, 
            error: myError
        })
    }
})

function chechUserLoggedIn(req, res){ 
    if(req.session.user){
      res.locals.userLoggedIn = true;
      res.redirect('/');
    }
  }

module.exports = router;
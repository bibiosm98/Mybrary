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
    console.log(req.body)

    const user = new User({
        name: req.body.name,
        email: req.body.email
    })
    const myError = new UserError({
        errorName: "Please type name"
    })
    // ,
        // errorEmail: "Please type email",
        // errorPassword: "Please type password"
    if( req.body.name != null && req.body.name != ''){
        myError.errorName = ''

        if(req.body.email != null && req.body.email != ''){
            
            if( req.body.password != null && 
                req.body.password != '' && 
                req.body.password == req.body.repeatPassword)
            {
                if(await User.findOne({email: new RegExp(req.body.email, 'i')})){
                    console.log("if")
                    myError.errorMessage = (req.body.email != '') ? "Email adres already use" : "Please type email";
                    
                    console.log(myError.errorMessage);
                    res.render('user/signup', {
                        user: user, 
                        error: myError
                    })
                }else{
                    console.log("else")
                    try{
                        user.password = await bcrypt.hash(req.body.password, 10);
                        const newUser = await user.save();
                        res.redirect('/')
                    }catch{
                        const myError = new UserError({
                            errorName: "Please type name",
                            errorEmail: "Please type email",
                            errorPassword: "Please type Password"
                        })
                        res.render('user/signup', {
                            user: user, 
                            error: myError
                        })
                    }
                }
            }else{
                res.render('user/signup', {
                    user: new User({
                        name: req.body.name,
                        email: req.body.email
                    }), 
                    error: new UserError({
                        errorMessage: (req.body.password == null || req.body.password == '') ? "Prosze podać hasło" : 
                            (req.body.password != req.body.repeatPassword) ? "Hasła są niezgodne" : "WTF?"
                    })
                })
            }
        }else{
            myError.errorEmail = "Please type email",
            res.render('user/signup', {user: user, error: myError})
        }
    }else{ res.render('user/signup', {user: user, error: myError}) }
})

function chechUserLoggedIn(req, res){ 
    if(req.session.user){
      res.locals.userLoggedIn = true;
      res.redirect('/');
    }
  }

module.exports = router;
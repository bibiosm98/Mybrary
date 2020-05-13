if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
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

// const emailExistence = require('email-existence')
const nodemailer = require('nodemailer');


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
    // emailExistence.check(req.body.email, (error, resp) => { // it doesnt work :/
    //     // const email = 2
    //     console.log(req.body.email+" res: " + resp)
    //     console.log(error)
    //     // user = await User.findOne({email: new RegExp(email, 'i')})
    // })
    
    if(userCorrectData){
        try{
            user.password = await bcrypt.hash(req.body.password, 10);
            const newUser = await user.save();

            try{
                let transport;
                if(process.env.NODE_ENV !== 'production'){
                    transport = nodemailer.createTransport({
                        host: 'smtp.mailtrap.io',
                        port: 2525,  //25 or 465 or 587 or 2525
                        auth: {
                        user: '1438ee8603fd90',
                        pass: '4bfc246adb101a'
                        }
                    });
                }else{
                    transport = nodemailer.createTransport({
                        host: process.env.GMAIL_HOST,
                        port: process.env.GMAIL_PORT,
                        auth: {
                            user: process.env.MAIL_LOGIN,
                            pass: process.env.MAIL_PASSWORD
                        }
                    });
                }

                const link = `http://localhost:3000/signup/${newUser.id}/verify`
                const message = {
                    from: process.env.MAIL_LOGIN, // Sender address
                    to: 'bibiosm98@gmail.com',         // List of recipients
                    subject: 'Mybrary account authentication', // Subject line
                    html: `<h1>Thanks you for creating free Mybrary account</h1><p>Your activation link is below <br><a href="${link}">Click Here</p>` // Plain text body
                };
                transport.sendMail(message, function(err, info) {
                    if (err) {
                    console.log(err)
                    } else {
                    console.log(info);
                    }
                });
            }catch(e){
                
            }

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


router.get('/:id/verify', async (req, res) =>{
    chechUserLoggedIn(req, res);
    try{
        const user = await (await User.findById(req.params.id)).updateOne({verify: true});
        // const user2 = (await User.findById(req.params.id));
        res.redirect('/');
    }catch{
        res.redirect('/');
    }
})


function chechUserLoggedIn(req, res){ 
    if(req.session.user){
      res.locals.userLoggedIn = true;
      res.redirect('/');
    }
  }

module.exports = router;
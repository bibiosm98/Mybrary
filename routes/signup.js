const express = require('express')
const router = express.Router()
const User = require('../models/user')
const UserError = require('../models/userError')

const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('../views/user/signup', {user: new User, error: new UserError});
})

router.post('/', async (req, res) =>{    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try{
        const newUser = await user.save();
        res.redirect('/')
    }catch{
        const myError = new UserError({
            // errorMessage: "Error creating new user",
            errorName: "Please type name",
            errorEmail: "Please type email",
            errorPassword: "Please type Password"
        })
        res.render('user/signup', {
            user: user, 
            error: myError
        })
    }
})

module.exports = router;
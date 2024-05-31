const express = require('express');
const User = require('../models/User');
const router = express.Router();
const {body , validationResult} = require('express-validator')
router.post('/',[
    body('email', "enter a valid email").isEmail(),
    body('name', "enter a valid name").isLength({min: 3}),
    body('password').isLength({min: 5})
], async (req,res)=> {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({error: result.array()});
    }
    let user   = await User.findOne({email: req.body.email});
    console.log(user)
    if(user){
        return res.status(400).json({error: "Sorry a user with this email is already exists"})
    }
    user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    })
    // .then(user => res.json(user))
    // .catch(err=> {console.log(err)
    //     res.json({error: "please enter a unique value for email"})
    // });
    res.json({name: user.name, email: user.email , password: user.password.length})
})

module.exports = router
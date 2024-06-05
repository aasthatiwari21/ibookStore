const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const JWT_SECRET = "AAstha@0222";
var fetchuser = require('../middleware/fetchUser')

// ROUTE 1 for creating a user #POST 
router.post('/', [
    body('email', "Enter a valid email").isEmail(),
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry, a user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        });

        const data = {
            user: {
                id: user.id
            }
        };
        const jwtToken = jwt.sign(data, JWT_SECRET);
        res.json({ token: jwtToken, user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//ROUTe 2 for login for POST
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const {email,password} = req.body;
    try {
        let user  = await User.findOne({email});
        if(!user){
            return res.status(400).json({ error: "Please try to login with correct credentials" }); 
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({ error: "Please try to login with correct credentials" }); 
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const jwtToken = jwt.sign(data, JWT_SECRET);
        res.json({ token: jwtToken})
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

//ROUTE 3 for getting logged in user detail's using post
router.post('/getuser', fetchuser, async (req, res) => {
try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
}catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})
module.exports = router;

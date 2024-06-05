const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const JWT_SECRET = "AAstha@0222";

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

module.exports = router;

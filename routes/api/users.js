const express = require("express");
const router = express.Router();
const gravarta = require("gravatar");
const bcrypt = require("bcryptjs");

const userModel = require("../../models/Users");

//@route POST api/users/register
//@desc Register user
//@access Public

router.post('/register', (req, res) => {
    userModel 
        .findOne({email: req.body.email})
        .then(user => {
            if(user) {
                return res.status(400).json({
                    msg: "Email 있음"
                })
            }else{
                const avatar = gravarta.url(req.body.email, {
                    s:'200', //size
                    r:'pg',  //Rating
                    d:'mm'  //Default
                });
                const newUser = new userModel({
                    name:req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                //password 암호화
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => res.json(err));
                    });
                })
            }
        })
        .catch(err => res.json(err));
});

module.exports = router;
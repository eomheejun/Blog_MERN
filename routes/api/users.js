const express = require("express");
const router = express.Router();
const gravarta = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require('passport');
const authcheck = passport.authenticate('jwt', {session: false}); 
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


const userModel = require("../../models/Users");

//@route POST api/users/register
//@desc Register user
//@access Public

router.post('/register', (req, res) => {

    const {errors, isValid} = validateRegisterInput(req.body);
    
    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }


    userModel 
        .findOne({email: req.body.email})
        .then(user => {
            if(user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
                // return res.status(400).json({
                //     msg: "Email 있음"
                // });
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



////@route POST api/users/login
//@desc login user and return jwt
//@access Public

router.post('/login', (req,res) => {
    
    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }


    const email = req.body.email;
    const password = req.body.password;

    //find user by email

    userModel
        .findOne({email})
        .then(user => {
            if(!user){

                errors.user = "no user";

                return res.status(400).json(errors);
                // return res.status(400).json({
                //     msg:"no user"
                // });
            }else{
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch){
                            //res.json({msg: 'Success'});
                            const payload = {id: user.id, name: user.name, avatar: user.avatar};

                            //sign token
                            jwt.sign(
                                payload,
                                keys.secretOrKey,
                                {expiresIn:3600},
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        tokeninfo: 'Bearer ' + token
                                    });
                                }
                            );
                    
                        }else{
                            errors.msg = "password incorrect";
                            return res.status(400).json(errors);
                            // return res.status(400).json({
                            //     msg: 'password incorrect'
                            // });
                        }
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => {res.json(err)});
});



//@route GET api/users/current
//@desc Return current user
//@acccess Private
router.get('/current',authcheck, (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;
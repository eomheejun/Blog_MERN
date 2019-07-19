const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const authcheck = passport.authenticate('jwt', {session: false}); 
const userModel = require('../../models/Users');
const profileModel = require('../../models/profile');


//@route GET api/profile
//@desc Get current users profile
//@access Private

router.get('/', authcheck, (req,res) => {
    const errors = {};

    profileModel
        .findOne({user: req.user.id})
        .then(profile =>{
            if(!profile){
                errors.noprofile = 'there is no profile';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.json(err));
});


module.exports = router;
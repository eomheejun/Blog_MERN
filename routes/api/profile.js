const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const authcheck = passport.authenticate('jwt', {session: false}); 
const userModel = require('../../models/Users');
const profileModel = require('../../models/profile');

const validateProfileInput = require('../../validation/profile');


//@route GET api/profile
//@desc Get current users profile
//@access Private

router.get('/', authcheck, (req,res) => {
    const errors = {};

    profileModel
        .findOne({user: req.user.id})
        .populate('user', ['name','avatar'])
        .then(profile =>{
            if(!profile){
                errors.noprofile = 'there is no profile';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.json(err));
});

//@route POST api/profile
//@desc Create or edit user profile
//@access Private

router.post('/', authcheck, (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);//맞으면 이상없고 틀리면 errors에 내용이담김

    //check valdiation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;

    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.bio) profileFields.bio = req.body.bio;

    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    } 

    //social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    profileModel
        .findOne({user: req.user.id})
        .then(profile =>{
            if(profile){
                //update
                profileModel
                    .findOneAndUpdate(
                        {user: req.user.id},
                        {$set: profileFields},
                        {new: true}
                    )
                    .then(profile => res.json(profile))
                    .catch(err => res.json(err));



            }else{
                //check if handle exists
                profileModel
                    .findOne({handle: profileFields.handle})
                    .then(profile => {
                        if(profile){
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }
                        new profileModel(profileFields)
                        .save()
                        .populate('user', ['name','avatar'])
                        .then(profile => res.json(profile))
                        .catch(err => res.json(err));
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));

});

//@route GET api/profile/all
//@desc Get all profiles
//@access Public

router.get('/all', (req, res) => {
    const error = {};
    profileModel
        .find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles){
                errors.msg = 'there are no profiles';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => console.log(err));

});

//@route GET api/profile/user/:user_id
//@desc Get profile by User ID
//@access public

router.get('/user/:user_id', (req, res) => {
    const error = {};

    profileModel
        .findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.msg = 'no profile'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => console.log(err));
});

//@route GET api/profile/handle/:handle_id
//@desc Get profile by handle
//@access public

router.get('/handle/:handle', (req, res) => {
    const error = {};

    profileModel
        .findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.msg = 'no profile'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => console.log(err));
});
module.exports = router;
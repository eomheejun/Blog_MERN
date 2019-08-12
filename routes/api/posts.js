const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

//Post model

const postModel = require('../../models/post');

//validation

const validatePostInput = require("../../validation/post");

const authcheck = passport.authenticate('jwt', {session: false});


//@route Post api/posts
//@desc create post
//@access Private

router.post('/', authcheck, (req, res) => {

    const {errors, isValid} = validatePostInput(req.body);

    //check validation

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new postModel({
        text: req.body.text,
        name: req.user.name,
        avatar: req.user.avatar,
        user: req.user.id //토큰에서받아옴
    });
    
    newPost
        .save()
        .then(post => res.json({
            msg: 'successful Posting',
            post: post
        }))
        .catch(err => res.json(err));
});


module.exports = router;
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

//Post model

const postModel = require('../../models/post');
const profileModel = require("../../models/profile");

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

//@route GET api/posts
//@desc show post
//@access Private

router.get('/', authcheck, (req, res) => {
    postModel
        .find()
        .sort({ date: -1})
        .then(posts => res.json({
            count: posts.length,
            posts: posts
        }))
        .catch(err => res.json(err))
});

//@route delete api/posts/:id
//@desc delete post
//@access Private

router.delete('/:id', authcheck, (req, res) => {
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            postModel
                .findById(req.params.id)
                .then(post => {
                    if(post.user.toString() !== req.user.id) {
                        return res.status(401).json({
                            msg: 'user not authorized'
                        });
                    }
                    post
                        .remove()
                        .then(() => res.json({msg: 'successful delete'}));

                })
                .catch(err => res.json(err));
        });
});

//@route get api/posts/:id
//@desc detail post
//@access Private

router.get('/:id', authcheck, (req, res)=>{
    postModel
        .findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.json(err));
});

//@route POST api/posts/like/:post_id
//@desc like post
//@access Private

router.post('/like/:post_id', authcheck, (req, res) => {
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            postModel
                .findById(req.params.post_id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({
                            msg: 'user already likes this post'
                        });
                    }

                    //add user id to likes array

                    post.likes.unshift({user: req.user.id});
                    post    
                        .save()
                        .then(post => res.json(post));

                })
                .catch(err => res.json(err));
        });
});

//@route POST api/posts/unlike/:post_id
//@desc unlike post
//@access Private

router.post('/unlike/:post_id', authcheck, (req, res) => {
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            postModel
                .findById(req.params.post_id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({
                            msg: 'you have not liked this post'
                        });
                    }

                    //get remove index

                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);
                    
                    //splice out of array

                    post.likes.splice(removeIndex, 1);

                    //save

                    post
                        .save()
                        .then(post => res.json(post));

                })
                .catch(err => res.json(err));
        });
        
});

//@route POST api/posts/comment/:post_id
//@desc add comment to post
//@access Private

router.post('/comment/:post_id', authcheck, (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);

    if(!isValid) {
        return res.status(400).json({
            msg: errors
        });
    };

    postModel
        .findById(req.params.post_id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.user.name,
                avatar: req.user.avatar,
                user: req.user.id
            };

            //add to comment unshift

            post.comments.unshift(newComment);
            post
                .save()
                .then(post => res.json(post));

        })
        .catch(err => res.json(err));
});

//@route DELETE api/posts/comment/:post_id/:comment_id
//@desc remove comment to post
//@access Private

router.delete('/comment/:post_id/:comment_id', authcheck, (req, res) => {
    postModel
        .findById(req.params.post_id)
        .then(post => {
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({
                    msg: 'comment does not exist'
                });
            }

            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);

            post.comments.splice(removeIndex, 1);
            post    
                .save()
                .then(post => res.json(post));
        });

});

module.exports = router;
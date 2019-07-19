//회원가입이후에 추가적인 옵션 ex)개인정보수정에 들어가서 추가적인 사항을 적어서 혜택을 줌

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'users'
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    experience: [],
    education: [],
    social: {
        youtube:{
            type:String
        },
        facebook:{
            type:String
        },
        instagram:{
            type:String
        },
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
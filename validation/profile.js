const Validator = require("validator");
const isEmpty = require("./is-empty");


module.exports = function validateProfileInput(data){
    let errors = {};

    //handle , status, skills (빈칸유무 할것)

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if(!Validator.isLength(data.handle, {min:2, max:40})) {
        errors.handle = 'handle needs to between 2 and 4 characters';
    }

    if(Validator.isEmpty(data.handle)) {
        errors.handle = 'handle fields is required';
        
    }
    if(Validator.isEmpty(data.status)) {
        errors.status = 'status fields is required';

    }
    if(Validator.isEmpty(data.skills)) {
        errors.skills = 'skills fields is required';
    }

    if(!isEmpty(data.website)) {
        if(!Validator.isURL(data.website)){
            errors.website = 'not a valid URL';
        }
    }
    if(!isEmpty(data.youtube)) {
        if(!Validator.isURL(data.youtube)){
            errors.youtube = 'not a valid URL';
        }
    }
    if(!isEmpty(data.facebook)) {
        if(!Validator.isURL(data.facebook)){
            errors.facebook = 'not a valid URL';
        }
    }
    if(!isEmpty(data.instagram)) {
        if(!Validator.isURL(data.instagram)){
            errors.instagram = 'not a valid URL';
        }
    }
    return{
        errors,
        isValid: isEmpty(errors)
    };
};
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validationExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.location = !isEmpty(data.location) ? data.location : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if(Validator.isEmpty(data.title)) {
        errors.title = "there are no title";
    }

    if(Validator.isEmpty(data.company)) {
        errors.company = "there are no company";
    }
    
    if(Validator.isEmpty(data.location)) {
        errors.location = "there are no location";
    }

    if(Validator.isEmpty(data.from)) {
        errors.from = "from is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}
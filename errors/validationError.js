import BaseError from "./baseError.js";

class ValidationError extends BaseError{
    constructor(errors){
        super(400, "Validation failed!", errors);
    }
}

export default ValidationError;
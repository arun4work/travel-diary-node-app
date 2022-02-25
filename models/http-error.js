class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // update message of Error object
        this.code = errorCode; //set http status code for the error obejct.
    }
}

module.exports = HttpError;

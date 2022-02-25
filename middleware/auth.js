const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const auth = async (req, res, next) => {
    try {
        if (req.method === 'OPTIONS') {
            return next();
        }
        const authToken = req.header('Authorization').replace('Bearer ', '');
        if (!authToken) {
            throw new Error();
        }
        const decodedToken = jwt.verify(authToken, 'mern-app-jwt-secrete');
        req.userData = {userId: decodedToken.id};
        next();
    } catch (err) {
        return next(new HttpError('Authentication failed!', 401));
    }
};

module.exports = auth;

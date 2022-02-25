const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
//user mode
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, `-password`); //shouldn't return password for all fetched users, so adding protection for password
        res.status(200).json(users);
    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
};

const signUp = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError('Invalid input. Please check your input.', 422);
        }
        const {name, email, password, image} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            image: req.file.path, //'https://i.pravatar.cc/300'
            places: [],
        });

        await newUser.save();
        const authToken = jwt.sign({id: newUser._id, email: newUser.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({_id: newUser._id, email: newUser.email, authToken: authToken});
    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
};

const logIn = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email: email});
        if (!existingUser) {
            throw new HttpError(`Invalid credentials!`, 422);
        }
        const isValidpassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidpassword) {
            throw new HttpError(`Invalid credentials!`, 422);
        }
        const authToken = jwt.sign({id: existingUser._id, email: existingUser.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({_id: existingUser._id, email: existingUser.email, authToken: authToken});
    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
};

module.exports = {
    getUsers,
    logIn,
    signUp,
};

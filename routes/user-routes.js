const express = require('express');
const {getUsers, logIn, signUp} = require('../controllers/user-controller');
const {check} = require('express-validator');
const fileUpload = require('../utils/file-upload');

const router = express.Router();

router.get('/api/user', getUsers);

router.post('/api/user/login', logIn);

router.post(
    '/api/user/signup',
    fileUpload.single('image'),
    [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6})],
    signUp
);

module.exports = router;

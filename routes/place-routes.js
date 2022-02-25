const express = require('express');
const {check} = require('express-validator');
const {getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace} = require('../controllers/place-controller');
const fileUpload = require('../utils/file-upload');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.get('/api/places/:placeId', getPlaceById);

router.get('/api/places/user/:userId', getPlacesByUserId);

router.use(authenticateUser);

router.post('/api/places/', fileUpload.single('image'), [check('title').not().isEmpty(), check('description').isLength({min: 6}), check('address').not().isEmpty()], createPlace);

router.patch('/api/places/:placeId', [check('title').not().isEmpty(), check('description').isLength({min: 6})], updatePlace);

router.delete('/api/places/:placeId', deletePlace);

module.exports = router;

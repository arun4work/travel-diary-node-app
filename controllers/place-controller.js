const fs = require('fs');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const getCoordinates = require('../utils/location');

//import Place model
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
    try {
        const place = await Place.findById(placeId);
        if (!place) {
            return next(new HttpError(`Couldn't find place information for the provided place id.`, 404));
        }
        res.json(place);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getPlacesByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        //const places = await Place.find({creator: userId}); //approach-1
        const {places} = await User.findById(userId).populate('places'); // approach-2 with virtual and setting up relationship with 2 collection

        // if (!places.length) {
        //     throw new HttpError(`Couldn't find places for the provided user id.`, 404);
        // }

        res.json(places);
    } catch (error) {
        return next(new HttpError(error.message, 404));
    }
};

const createPlace = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError(`Invalid input. Please check your input data.`, 422);
        }
        const {title, description, address, creator} = req.body;

        const user = await User.findById(req.userData.userId);
        if (!user) {
            throw new HttpError(`User doesn't exist with the provided id.`, 404);
        }

        const coordinates = await getCoordinates(address);

        const createdPlace = new Place({
            title,
            description,
            address,
            imageUrl: req.file.path, //'https://images.newindianexpress.com/uploads/user/imagelibrary/2020/10/11/w1200X800/IMG_20200902_170348_2.jpg',
            location: coordinates,
            creator: req.userData.userId,
        });
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
        res.status(201).json(createdPlace);
    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
};

const updatePlace = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError(`Invalid input. Please check your input data.`, 422);
        }
        const {title, description} = req.body;
        const placeId = req.params.placeId;
        const place = await Place.findById(placeId);
        if (!place) {
            return next(new HttpError(`Couldn't find the place for the provided id`, 404));
        }

        if (req.userData.userId !== place.creator.toString()) {
            return next(new HttpError(`You are not allowed to edit this place.`, 401));
        }

        place.title = title;
        place.description = description;
        await place.save();
        res.status(200).json(place);
    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
};

const deletePlace = async (req, res, next) => {
    try {
        const placeId = req.params.placeId;
        //const place = await Place.findById(placeId);
        const place = await Place.findById(placeId).populate('creator');
        const imagePath = place.imageUrl;
        if (!place) {
            return next(new HttpError(`Couldn't find the place for the provided id`, 404));
        }

        if (req.userData.userId !== place.creator.id.toString()) {
            return next(new HttpError(`You are not allowed to edit this place.`, 401));
        }

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await place.remove({session: sess});
            place.creator.places.pull(place);
            await place.creator.save({session: sess});
            sess.commitTransaction();
        } catch (error) {
            return next(new HttpError(`Couldn't delete the place. Something went wrong.`, 404));
        }

        fs.unlink(imagePath, (err) => {
            console.log(err);
        });
        res.status(200).json({message: 'Place deleted successfully!'});
    } catch (error) {
        return next(new HttpError(error.message, 400));
    }
};

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlace,
    deletePlace,
};

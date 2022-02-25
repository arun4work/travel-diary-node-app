const mongoose = require('mongoose');

//create place schema

const placeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    location: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User', // Adding a ref to make relation with user schema
    },
});

//create place model placeSchema
const Place = mongoose.model('Place', placeSchema);

module.exports = Place;

const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

//create user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    image: {
        type: String,
        trim: true,
        required: true,
    },
    places: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Place', // Adding a ref to make relation with place schema
        },
    ],
});

//userSchema.plugin(uniqueValidator);

// //create relationship between User and Place collection for user created places list information
// userSchema.virtual('places', {
//     ref: 'Place',
//     localField: '_id',
//     foreignField: 'creator',
// });

//create user model using user schema
const User = mongoose.model('User', userSchema);

module.exports = User;

const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const placeRoutes = require('./routes/place-routes');
const userRoutes = require('./routes/user-routes');

const app = express();

//express.json() setup is required to convert incoming JSON query string to javascript object to access through req.body
app.use(express.json());

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use(userRoutes);
app.use(placeRoutes);

// any unwanted route handling
app.use((req, res, next) => {
    const error = new HttpError(`Couldn't find the route.`, 404);
    throw error;
});

//configuration for handling all error handling and set status code and message with response and send
app.use((error, req, res, next) => {
    //remove the uploaded image on any error
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

//mongo DB connection and then server start

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dr0fd.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
        autoIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(process.env.PORT);
    })
    .catch((err) => console.log(err));

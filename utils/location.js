const axios = require('axios');
const HttpError = require('../models/http-error');

const getCoordinates = async (address) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAP_BOX_ACCESS_TOKEN}`;
    let coordinates;
    try {
        const result = await axios.get(url);
        coordinates = result.data.features[0].geometry.coordinates;
    } catch (error) {
        throw new HttpError(`Couldn't find location for the address`, 422);
    }
    return {
        lat: coordinates[1],
        lng: coordinates[0],
    };
};

module.exports = getCoordinates;

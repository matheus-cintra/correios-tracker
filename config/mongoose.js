const mongoose = require('mongoose');

let URI = process.env.MONGO_URI || 'mongodb://localhost/getTrackInfo';

(() => {
    mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.warn('Connected at mongo...');
    })
})()
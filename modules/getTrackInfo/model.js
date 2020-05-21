const mongoose = require('mongoose');

const info = {
    status: String,
    data: String,
    local: String,
}

const trackSchema = new mongoose.Schema({
    trackNumber: String,
    searchData: { type: Date, default: Date.now },
    info: info
}, {versionKey: false});

const Track = new mongoose.model('Tracking Info', trackSchema, 'core_track_info');

module.exports = Track
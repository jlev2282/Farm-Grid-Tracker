const mongoose = require('mongoose');

const gridSchema = new mongoose.Schema({
    quadrant: Number,
    soil: String,
    crop: String,
    soilState: String,
    cropState: String,
    disease: String,
});

module.exports = mongoose.model('Grid', gridSchema);

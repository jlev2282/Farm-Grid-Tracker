const mongoose = require('mongoose');

const gridSchema = new mongoose.Schema({
    gridNumber: { type: Number, required: true, unique: true },
    soilType: { type: String, required: true },
    soilStatus: { type: String, required: true },
    crop: { type: String, required: true },
    cropStatus: { type: String, required: true },
    disease: { type: String, required: true },
    notes: { type: String, maxlength: 100 },
});

module.exports = mongoose.model('Grid', gridSchema);

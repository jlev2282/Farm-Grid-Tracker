const express = require('express');
const router = express.Router();
const axios = require('axios');
const Grid = require('../models/Grid');
const dotenv = require('dotenv');

// Fetch weather data
router.get('/weather/:zipCode', async (req, res) => {
    const zipCode = req.params.zipCode;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch all grids
router.get('/grid', async (req, res) => {
    try {
        const grids = await Grid.find();
        res.json(grids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create or update a grid
router.post('/grid', async (req, res) => {
    const { gridNumber, soilType, soilStatus, crop, cropStatus, disease, notes } = req.body;

    try {
        let grid = await Grid.findOne({ gridNumber });
        if (grid) {
            // Update existing grid
            grid.soilType = soilType;
            grid.soilStatus = soilStatus;
            grid.crop = crop;
            grid.cropStatus = cropStatus;
            grid.disease = disease;
            grid.notes = notes;
        } else {
            // Create new grid
            grid = new Grid({
                gridNumber,
                soilType,
                soilStatus,
                crop,
                cropStatus,
                disease,
                notes,
            });
        }
        await grid.save();
        res.status(201).json(grid);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a grid
router.delete('/grid/:gridNumber', async (req, res) => {
    const gridNumber = req.params.gridNumber;
    try {
        const grid = await Grid.findOneAndDelete({ gridNumber });
        if (!grid) {
            return res.status(404).json({ message: 'Grid not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

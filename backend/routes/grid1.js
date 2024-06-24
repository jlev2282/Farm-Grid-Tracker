const express = require('express');
const Grid = require('../models/Grid1');
const axios = require('axios'); // Ensure axios is imported
const router = express.Router();

// Create or Update Grid Data
router.post('/:quadrant', async (req, res) => {
    const { quadrant } = req.params;
    const { soil, crop, soilState, cropState, disease } = req.body;

    try {
        const gridData = await Grid.findOneAndUpdate(
            { quadrant: quadrant },
            { soil, crop, soilState, cropState, disease },
            { new: true, upsert: true }
        );
        res.json(gridData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get All Grid Data
router.get('/grid', async (req, res) => {
    try {
        const gridData = await Grid.find();
        res.json(gridData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get Weather Data
router.get('/weather/:zip', async (req, res) => {
    const zip = req.params.zip;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

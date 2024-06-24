const express = require('express');
const axios = require('axios');
const Grid = require('../models/Grid');
const router = express.Router();
const dotenv = reqquire('dotenv');

router.get('/weather/:zip', async (req, res) => {
    const zip = req.params.zip;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/grid', async (req, res) => {
    try {
        const gridData = await Grid.find();
        res.json(gridData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// router.post('/grid', async (req, res) => {
//     const newGrid = new Grid(req.body);

//     try {
//         await newGrid.save();
//         res.status(201).json(newGrid);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

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
            await grid.save();
        } else {
            // Create new grid
            grid = new Grid({
                gridNumber,
                soilType,
                soilStatus,
                crop,
                cropStatus,
                disease,
                notes
            });
            await grid.save();
        }

        res.status(200).json(grid);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/grid/:gridNumber', async (req, res) => {
    const gridNumber = req.params.gridNumber;

    try {
        const grid = await Grid.findOneAndDelete({ gridNumber });
        if (grid) {
            res.status(200).json({ message: 'Grid deleted successfully' });
        } else {
            res.status(404).json({ message: 'Grid not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

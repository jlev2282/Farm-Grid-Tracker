const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const gridRoutes = require('./routes/grid');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Use the grid routes under the /api/grid path
app.use('/api/grid', gridRoutes);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


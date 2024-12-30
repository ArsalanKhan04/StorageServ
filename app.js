const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const videoRoutes = require('./routes/videoRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Use routes
app.use('/api', videoRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log('StorageMgmtServ running on port 3001'));

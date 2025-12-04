const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// import routes
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const gameRoutes = require('./routes/gameRoutes');
const characterRoutes = require('./routes/characterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const gameCardRoutes = require('./routes/gamecardRoutes');


const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(bodyParser.json());

// DB connection
const MONGO_URL = 'mongodb+srv://alsdei:iloveyaoih3h3.@dexcluster.eqqgj9w.mongodb.net/FPSeCuan?appName=DexCluster';

mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB Connected to the server'))
  .catch(err => console.log('DB Connection failed', err));

// use routes
app.use('/api', userRoutes);
app.use('/api', transactionRoutes);
app.use('/api', gameRoutes);
app.use('/api', characterRoutes);
app.use('/api', adminRoutes);
app.use('/api/gamecards', gameCardRoutes);


// server starto
app.listen(PORT, () => {
  console.log('Server runnning on http://localhost:' + PORT);
});

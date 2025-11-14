const path = require('path');
// Make sure dotenv is at the very top
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// --- FINAL UPDATE: CORS CONFIGURATION ---
const corsOptions = {
  // Use the exact Vercel URL you provided
  origin: 'https://taskmanager001.vercel.app', 
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
// --- END UPDATE ---

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/tasks', require('./routes/api/tasks'));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
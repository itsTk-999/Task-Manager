const path = require('path');
// Make sure dotenv is at the very top
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// --- FINAL CORS CONFIGURATION ---
// Define the list of allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Allows local frontend development
  'https://taskmanager001.vercel.app',
  'https://taskmanager-git-main-lil-tks-projects.vercel.app',
'https://taskmanager-17l4v8fb8-lil-tks-projects.vercel.app' // Your production Vercel URL
];

const corsOptions = {
  // Use a function to check if the request origin is in the allowed list
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or direct backend calls)
    if (!origin) return callback(null, true); 
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      // Origin is in the allowed list
      callback(null, true);
    } else {
      // Origin is not allowed
      console.error(`CORS Blocked: Origin ${origin} not in allowed list.`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
// --- END FINAL CORS CONFIGURATION ---

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/tasks', require('./routes/api/tasks'));

// Simple endpoint to check if the API server is running
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
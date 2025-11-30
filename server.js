import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import auth from './routes/authRoute.js';
import team from './routes/teamRoute.js';
import client from './routes/clientRoute.js';
import lead from './routes/leadRoute.js';
import docs from './routes/docsRoute.js';

import logger from './middleware/loggerMiddleware.js';
import errorHandler from './middleware/errorMiddleware.js';
import notFoundHandler from './middleware/notFoundMiddleware.js';

import connectDB from './db.js';

import dotenv from 'dotenv';
dotenv.config();

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

// CORS Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/auth', auth);
app.use('/api/team', team);
app.use('/api/client', client);
app.use('/api/lead', lead);
app.use('/api/docs', docs);

// Connect to database
connectDB();

// Error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
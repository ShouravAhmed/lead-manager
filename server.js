import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import auth from './routes/authRoute.js';
import team from './routes/teamRoute.js';
import client from './routes/clientRoute.js';
import lead from './routes/leadRoute.js';
import docs from './routes/docsRoute.js';
import logger from './middleware/loggerMiddleware.js';
import errorHandler from './middleware/errorMiddleware.js';
import notFoundHandler from './middleware/notFoundMiddleware.js';
import connectDB from './db.js';
import { createServer } from "@vercel/node";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', auth);
app.use('/api/team', team);
app.use('/api/client', client);
app.use('/api/lead', lead);
app.use('/api/docs', docs);

// Database Connection
connectDB();

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Export as a handler for Vercel
export default createServer(app);

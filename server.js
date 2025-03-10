import express from 'express';
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

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logger middleware
app.use(logger);

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/auth', auth);
app.use('/api/team', team);
app.use('/api/client', client);
app.use('/api/lead', lead);
app.use('/api/docs', docs);

// connect to database
connectDB();

// error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
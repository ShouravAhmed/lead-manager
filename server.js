import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// import posts from './routes/postRoute.js';
// import auth from './routes/authRoute.js';

import logger from './middleware/logger-middleware.js';
import errorHandler from './middleware/error-middleware.js';
import notFoundHandler from './middleware/not-found-middleware.js';

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

// // post routes
// app.use('/api/posts', posts);

// // auth routes
// app.use('/api/auth', auth);

// connect to database
connectDB();

// error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // allow all origins
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // allow cookies
  })
);

// this is for submitting data form form-body json
app.use(
  express.json({
    limit: '16kb', //without configuration also works for production purposes doing this
  })
);

// this is for data form url -> encode data
app.use(express.urlencoded({ extended: true, limit: '16kb' })); //using extended we can pass nested objects

// this is for storing data ex image, video, music, pdf etc
app.use(express.static('public')); //public is folder name

app.use(cookieParser()); // to parse cookies

//All routes imports
import adminUserRoutes from './routes/admin-user.routes.js';
//All Routes declarations
app.use('/api/v1/admin-user', adminUserRoutes);

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Path not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

export default app;

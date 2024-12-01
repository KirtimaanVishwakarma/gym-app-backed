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

export default app;

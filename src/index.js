import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import connectDB from './db/mongodb.js';
import app from './app.js';

connectDB()
  .then(() => {
    app.on('error', (err) => {
      console.error('Listing Error:', err);
      throw err;
    });
    app.listen(process.env.PORT || 8080, () => {
      console.log(`server listening on: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('App Listening FAILED', err);
  });

import dotenv from 'dotenv';
import connectDB from './db/mongodb.js';
import app from './app.js';

dotenv.config({ path: './.env' });

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

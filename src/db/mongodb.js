import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      'MongoDB Connected !!\nDB Host: ' +
        connectionInstance.connection.host +
        '\n' +
        'Connected DB PORT :' +
        connectionInstance.connection.port
    );
  } catch (error) {
    console.error('Mongodb connection error :', error);
    process.exit(1); // method with code to exit the process of mongoose
  }
};

export default connectDB;

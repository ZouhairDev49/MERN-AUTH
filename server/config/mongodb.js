import mongoose from 'mongoose'; 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log('✅ Connected to local MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
};

export default connectDB;

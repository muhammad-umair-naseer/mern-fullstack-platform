import mongoose from 'mongoose';


export const connectDB = async () => {
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI missing in environment');
mongoose.set('strictQuery', true);
await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'mern-platform' });
console.log('📦 Connected to MongoDB');
};
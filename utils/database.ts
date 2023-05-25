import { log } from 'console';
import mongoose from 'mongoose';

let isConnected: boolean = false;
export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected) {
        console.log('=> using existing database connection');
        return;
    }
    console.log('=> using new database connection');
    try {
        await mongoose.connect(process.env.MONGO_URI || '', {
            dbName: process.env.MONGO_DB_NAME,
        });
        isConnected = true;
        console.log('=> connection established');
    } catch (error) {
        console.log(error);
    }
};

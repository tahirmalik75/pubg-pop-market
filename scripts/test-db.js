
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing connection to:', MONGODB_URI);

async function test() {
    try {
        const start = Date.now();
        await mongoose.connect(MONGODB_URI!, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('Successfully connected to MongoDB in', Date.now() - start, 'ms');
        process.exit(0);
    } catch (err) {
        console.error('FAILED to connect to MongoDB:');
        console.error(err.message);
        process.exit(1);
    }
}

test();

import connectDB from './lib/mongodb.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function setupAdmin() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        const phone = 'admin';
        const existing = await User.findOne({ phone });
        if (existing) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('Mmalik123', 12);
        await User.create({
            name: 'maliksahab',
            phone,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin user created successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

setupAdmin();

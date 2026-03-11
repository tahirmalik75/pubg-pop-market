import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ phone: 'admin' });
        if (existingAdmin) {
            return NextResponse.json({ message: 'Admin user already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('Mmalik123', 12);

        // Create the admin user
        const admin = await User.create({
            name: 'maliksahab',
            phone: 'admin',
            password: hashedPassword,
            role: 'admin',
        });

        return NextResponse.json({
            message: 'Admin user created successfully',
            user: {
                name: admin.name,
                phone: admin.phone,
                role: admin.role,
            },
        });
    } catch (error: any) {
        console.error('Admin setup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

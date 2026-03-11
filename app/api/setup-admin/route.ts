import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
    try {
        await connectDB()

        // Check if admin already exists
        const existingAdmin = await User.findOne({ phone: '03340060094' })
        if (existingAdmin) {
            return NextResponse.json({ message: 'Admin already exists' })
        }

        // Create admin user with your credentials
        const hashedPassword = await bcrypt.hash('Mmalik123321', 10)

        const admin = new User({
            name: 'maliksahab',
            phone: '03340060094',
            password: hashedPassword,
            role: 'admin'
        })

        await admin.save()

        return NextResponse.json({
            message: 'Admin created successfully',
            credentials: {
                name: 'maliksahab',
                phone: '03340060094',
                password: 'Mmalik123321'
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
    }
}

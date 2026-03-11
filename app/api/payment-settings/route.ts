import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PaymentSettings from '@/models/PaymentSettings';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        await connectDB();
        const settings = await PaymentSettings.findOne({}) || {
            jazzcashNumber: '',
            easypaisaNumber: '',
            accountName: '',
            bankDetails: '',
        };
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions as any);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { jazzcashNumber, easypaisaNumber, accountName, bankDetails } = body;

        await connectDB();
        const updatedSettings = await PaymentSettings.findOneAndUpdate(
            {},
            { jazzcashNumber, easypaisaNumber, accountName, bankDetails },
            { upsert: true, new: true }
        );

        return NextResponse.json(updatedSettings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}

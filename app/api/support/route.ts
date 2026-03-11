import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const { name, phone, subject, message } = await req.json();

        if (!name || !phone || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const session: any = await getServerSession(authOptions as any);

        await connectDB();

        const ticket = await SupportTicket.create({
            userId: session?.user?.id || null,
            name,
            phone,
            subject,
            message,
        });

        return NextResponse.json({ success: true, ticket });
    } catch (error) {
        console.error('Support ticket creation error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Card from '@/models/Card';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        await connectDB();
        const cards = await Card.find({}).sort({ createdAt: -1 });
        return NextResponse.json(cards);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions as any);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, price, image, category, stock } = body;

        if (!title || !price || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();
        const newCard = await Card.create({
            title,
            price,
            image: image || 'https://placehold.co/400x400/111/444?text=Card',
            category,
            stock: stock || 0,
        });

        return NextResponse.json(newCard, { status: 201 });
    } catch (error) {
        console.error('Create card error:', error);
        return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
    }
}

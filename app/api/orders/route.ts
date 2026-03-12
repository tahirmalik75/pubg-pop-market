import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Card from '@/models/Card';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions as any);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const orders = await Order.find({ userId: session.user.id })
            .populate('cardId', 'title image')
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions as any);
        if (!session) {
            return NextResponse.json({ error: 'Please login to place an order' }, { status: 401 });
        }

        const formData = await req.formData();
        const cardId = formData.get('cardId') as string;
        const amount = formData.get('amount') as string;
        const quantity = formData.get('quantity') as string;
        const transactionId = formData.get('transactionId') as string;
        const file = formData.get('paymentProof') as File | null;

        if (!cardId || !amount || !transactionId || !file) {
            return NextResponse.json({ error: 'Missing required order details or payment proof' }, { status: 400 });
        }

        await connectDB();

        // Upload payment proof to Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadResult: any = await uploadToCloudinary(buffer, 'payment_proofs');
        const cloudinaryUrl = uploadResult.secure_url;

        const order = await Order.create({
            userId: session.user.id,
            cardId,
            amount: parseFloat(amount),
            quantity: parseInt(quantity) || 1,
            transactionId,
            paymentProof: cloudinaryUrl,
            status: 'pending',
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Create order error:', error);
        if ((error as any).code === 11000) {
            return NextResponse.json({ error: 'Transaction ID already used' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}

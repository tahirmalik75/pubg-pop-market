import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result: any = await uploadToCloudinary(buffer, 'uploads');

        return NextResponse.json({ 
            success: true,
            url: result.secure_url 
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            error: 'Upload failed', 
            details: error.message 
        }, { status: 500 });
    }
}

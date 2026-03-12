// Load .env.local manually for the script if not in Next.js environment
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { uploadToCloudinary } from '../lib/cloudinary';
import fs from 'fs';
import path from 'path';

async function testUpload() {
  console.log('Testing Cloudinary configuration...');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

  try {
    // Create a dummy buffer (a 1x1 transparent pixel)
    const dummyBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );

    console.log('Uploading dummy image to Cloudinary...');
    const result: any = await uploadToCloudinary(dummyBuffer, 'test_uploads');
    
    console.log('Upload successful!');
    console.log('URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    
    process.exit(0);
  } catch (error) {
    console.error('Upload failed:');
    console.error(error);
    process.exit(1);
  }
}

testUpload();

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary credentials...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'NOT SET');

// Test the connection
cloudinary.api.ping()
    .then(result => {
        console.log('\n✅ SUCCESS! Cloudinary credentials are VALID!');
        console.log('Response:', result);
        process.exit(0);
    })
    .catch(error => {
        console.log('\n❌ FAILED! Cloudinary credentials are INVALID!');
        console.log('Error:', error.message);
        console.log('\nPlease get valid credentials from: https://cloudinary.com/console');
        process.exit(1);
    });

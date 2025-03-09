import cloudinary from 'cloudinary';
import { unlink } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'avatars',
      transformation: [{ width: 300, height: 300, crop: 'fill' }],
    });
    await unlink(filePath);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('Failed to upload image');
  }
};

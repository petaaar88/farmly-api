import supabase from '../config/supabase.js';
import crypto from 'crypto';

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || 'product-images';

const generateFileName = (originalName) => {
  const extension = originalName.split('.').pop();
  const uniqueId = crypto.randomUUID();
  return `${uniqueId}.${extension}`;
};

const uploadImage = async (file, folder = 'products') => {
  const fileName = generateFileName(file.originalname);
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw new Error(`Failed to upload image: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

const deleteImage = async (imageUrl) => {
  const urlParts = imageUrl.split('/');
  const filePath = `products/${urlParts[urlParts.length - 1]}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) throw new Error(`Failed to delete image: ${error.message}`);
};

export { uploadImage, deleteImage };

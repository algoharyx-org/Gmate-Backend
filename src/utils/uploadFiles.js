import cloudinary from '../config/cloudinary.js';
import { createBadRequestError } from './APIErrors.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadToCloudinary = async (file, folder = 'GMATE') => {
  if (!file) {
    throw createBadRequestError('File object is required');
  }

  const publicId = `${uuidv4()}-${file.originalname?.split('.')[0] || 'uploaded'}`;
  const uploadOptions = {
    folder,
    resource_type: 'auto',
    publicId,
  };

  try {
    let result;

    if (file.path) {
      result = await cloudinary.uploader.upload(file.path, uploadOptions);
    } else if (file.buffer) {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      result = await cloudinary.uploader.upload(dataUri, uploadOptions);
    } else {
      throw createBadRequestError('No valid file path or buffer found for upload');
    }

    return {
      url: result.secure_url || result.url,
      publicId: result.public_id,
      type: result.resource_type,
      size: result.bytes,
    };
  } catch (error) {
    throw createBadRequestError(`Failed to upload file to Cloudinary: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    return false;
  }
};
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload single image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Object} options - Additional upload options
 * @returns {Promise<string>} - URL of uploaded image
 */
export const uploadImageToCloudinary = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);
    
    // Optional: Add folder organization
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    
    // Optional: Add tags for better organization
    if (options.tags) {
      formData.append('tags', options.tags.join(','));
    }
    
    // Optional: Set quality and format
    if (options.quality) {
      formData.append('quality', options.quality);
    }
    
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (options.onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          options.onProgress(percentCompleted);
        }
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(
      error.response?.data?.error?.message || 'Failed to upload image'
    );
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @param {Object} options - Additional upload options
 * @returns {Promise<string[]>} - Array of uploaded image URLs
 */
export const uploadMultipleImages = async (files, options = {}) => {
  try {
    const uploadPromises = files.map((file, index) => 
      uploadImageToCloudinary(file, {
        ...options,
        onProgress: (percent) => {
          if (options.onProgress) {
            options.onProgress(index, percent);
          }
        },
      })
    );

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of image to delete
 * @returns {Promise<Object>} - Response from Cloudinary
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    // Note: Deletion requires authentication with API secret on backend
    // This should ideally be done through your backend API
    console.warn('Image deletion should be handled by backend for security');
    throw new Error('Please implement image deletion through your backend API');
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export const extractPublicId = (url) => {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

/**
 * Generate optimized URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {Object} transformations - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedImageUrl = (url, transformations = {}) => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = transformations;

  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transforms = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
};

const cloudinaryService = {
  uploadImageToCloudinary,
  uploadMultipleImages,
  deleteImageFromCloudinary,
  extractPublicId,
  getOptimizedImageUrl,
};

export default cloudinaryService;

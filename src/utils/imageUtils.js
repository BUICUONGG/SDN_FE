/**
 * Resize image to specified dimensions while maintaining aspect ratio
 * @param {File} file - Original image file
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<File>} - Resized image file
 */
export const resizeImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.9) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            
            resolve(resizedFile);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
};

/**
 * Compress image while maintaining quality
 * @param {File} file - Original image file
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, quality = 0.8) => {
  // Use current dimensions, just compress
  return resizeImage(file, Infinity, Infinity, quality);
};

/**
 * Convert image to WebP format for better compression
 * Note: Not all browsers support WebP encoding
 * @param {File} file - Original image file
 * @param {number} quality - WebP quality (0-1)
 * @returns {Promise<File>} - WebP image file
 */
export const convertToWebP = (file, quality = 0.9) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('WebP conversion failed or not supported'));
              return;
            }
            
            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, '.webp'),
              { type: 'image/webp', lastModified: Date.now() }
            );
            
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
};

/**
 * Get image dimensions without loading full image
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export const validateImage = async (
  file,
  options = {
    maxSize: 5 * 1024 * 1024, // 5MB
    minWidth: 100,
    minHeight: 100,
    maxWidth: 5000,
    maxHeight: 5000,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  }
) => {
  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed: ${options.allowedTypes.join(', ')}`,
    };
  }
  
  if (file.size > options.maxSize) {
    return {
      valid: false,
      error: `File too large. Max size: ${(options.maxSize / 1024 / 1024).toFixed(1)}MB`,
    };
  }
  
  try {
    const { width, height } = await getImageDimensions(file);
    
    if (width < options.minWidth || height < options.minHeight) {
      return {
        valid: false,
        error: `Image too small. Min: ${options.minWidth}x${options.minHeight}px`,
      };
    }
    
    if (width > options.maxWidth || height > options.maxHeight) {
      return {
        valid: false,
        error: `Image too large. Max: ${options.maxWidth}x${options.maxHeight}px`,
      };
    }
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

/**
 * Auto-optimize image before upload
 * Resizes and compresses based on file size
 * @param {File} file - Original image file
 * @returns {Promise<File>} - Optimized image file
 */
export const autoOptimizeImage = async (file) => {
  const size = file.size;
  
  if (size < 500 * 1024) { // < 500KB
    return file;
  }
  
  const { width, height } = await getImageDimensions(file);
  
  let maxWidth, maxHeight, quality;
  
  if (size > 3 * 1024 * 1024) { // > 3MB
    maxWidth = 1600;
    maxHeight = 1200;
    quality = 0.8;
  } else if (size > 1 * 1024 * 1024) { // > 1MB
    maxWidth = 1920;
    maxHeight = 1080;
    quality = 0.85;
  } else {
    maxWidth = 1920;
    maxHeight = 1080;
    quality = 0.9;
  }
  
  if (width > maxWidth || height > maxHeight) {
    return resizeImage(file, maxWidth, maxHeight, quality);
  } else {
    return compressImage(file, quality);
  }
};

const imageUtils = {
  resizeImage,
  compressImage,
  convertToWebP,
  getImageDimensions,
  validateImage,
  autoOptimizeImage,
};

export default imageUtils;

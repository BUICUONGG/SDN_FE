import React, { useState } from 'react';
import { Upload, Button, message, Progress, Space, Image } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import cloudinaryService from '../../service/cloudinaryService';
import imageUtils from '../../utils/imageUtils';
import './ImageUploader.css';

/**
 * ImageUploader Component - Upload images to Cloudinary
 * @param {Object} props
 * @param {Function} props.onChange - Callback when images are uploaded, receives array of URLs
 * @param {number} props.maxCount - Maximum number of images (default: 5)
 * @param {Array} props.defaultImageUrls - Default image URLs to display
 * @param {string} props.folder - Cloudinary folder to organize images
 * @param {Array} props.tags - Tags for uploaded images
 * @param {boolean} props.multiple - Allow multiple file selection (default: true)
 */
const ImageUploader = ({
  onChange,
  maxCount = 5,
  defaultImageUrls = [],
  folder = 'ev-products',
  tags = ['product'],
  multiple = true,
}) => {
  const [imageUrls, setImageUrls] = useState(defaultImageUrls);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      
      // Validate file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được upload file ảnh!');
        onError(new Error('Invalid file type'));
        return;
      }

      // Validate file size (max 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Ảnh phải nhỏ hơn 5MB!');
        onError(new Error('File too large'));
        return;
      }

      // Auto-optimize image before upload (resize + compress if needed)
      const optimizedFile = await imageUtils.autoOptimizeImage(file);
      
      // Show optimization result
      if (optimizedFile.size < file.size) {
        const savedPercent = Math.round(((file.size - optimizedFile.size) / file.size) * 100);
        console.log(`Image optimized: ${savedPercent}% smaller`);
      }

      // Upload to Cloudinary
      const url = await cloudinaryService.uploadImageToCloudinary(optimizedFile, {
        folder,
        tags,
        quality: 'auto:good',
        onProgress: (percent) => {
          setUploadProgress((prev) => ({
            ...prev,
            [file.uid]: percent,
          }));
        },
      });

      const newUrls = [...imageUrls, url];
      setImageUrls(newUrls);
      
      if (onChange) {
        onChange(newUrls);
      }

      message.success('Upload ảnh thành công!');
      onSuccess(url);
      
      // Clear progress after success
      setTimeout(() => {
        setUploadProgress((prev) => {
          const updated = { ...prev };
          delete updated[file.uid];
          return updated;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.message || 'Upload ảnh thất bại!');
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    
    if (onChange) {
      onChange(newUrls);
    }
    
    message.success('Đã xóa ảnh!');
  };

  const handlePreview = (url) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const uploadButton = (
    <Button 
      icon={<UploadOutlined />} 
      loading={uploading}
      disabled={imageUrls.length >= maxCount}
    >
      {uploading ? 'Đang tải...' : 'Upload ảnh'}
    </Button>
  );

  return (
    <div className="image-uploader-container">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Upload Button */}
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          multiple={multiple}
          accept="image/*"
          disabled={imageUrls.length >= maxCount}
        >
          {uploadButton}
        </Upload>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="upload-progress-container">
            {Object.entries(uploadProgress).map(([uid, percent]) => (
              <div key={uid} style={{ marginBottom: 8 }}>
                <Progress percent={percent} status="active" />
              </div>
            ))}
          </div>
        )}

        {/* Image Preview Grid */}
        {imageUrls.length > 0 && (
          <div className="image-grid">
            {imageUrls.map((url, index) => (
              <div key={index} className="image-item">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                
                {/* Overlay Actions */}
                <div className="image-overlay">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(url)}
                    size="small"
                  />
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(index)}
                    size="small"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        <Image
          preview={{
            visible: previewVisible,
            src: previewImage,
            onVisibleChange: (visible) => setPreviewVisible(visible),
          }}
          style={{ display: 'none' }}
        />

        {/* Info Text */}
        <div className="upload-info">
          {imageUrls.length}/{maxCount} ảnh • Kích thước tối đa: 5MB • Định dạng: JPG, PNG, GIF
        </div>
      </Space>
    </div>
  );
};

export default ImageUploader;

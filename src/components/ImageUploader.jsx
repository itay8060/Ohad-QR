import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage, storeLatestImageUrl } from '../services/imageService';

const ImageUploader = ({ onImageUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      // Upload to ImgChest
      const response = await uploadImage(file);
      const imageUrl = response.imageUrl;
      const deleteUrl = response.deleteUrl;
      
      console.log("Upload successful:", { imageUrl, deleteUrl });
      
      // Store the URL and delete URL in localStorage
      storeLatestImageUrl(imageUrl, deleteUrl);
      
      // Pass URL to parent component
      onImageUpload(imageUrl, deleteUrl);
      
      setUploadStatus({ 
        type: 'success', 
        message: 'Image uploaded successfully!' 
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // More detailed error message
      let errorMessage = 'Error uploading image';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.error || 'Server error: ' + error.response.status;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Check your internet connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      setUploadStatus({ 
        type: 'error', 
        message: errorMessage
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <div className="upload-container">
        <div 
          {...getRootProps({ 
            className: 'dropzone',
            onClick: (event) => {
              if (file) {
                event.stopPropagation(); // Prevent opening file dialog if we already have a file
                handleUpload();
              }
            }
          })}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="upload-status">
              <p>Uploading...</p>
              <span className="loading"></span>
            </div>
          ) : isDragActive ? (
            <p>Drop the image here...</p>
          ) : file ? (
            <p>Click to upload this image</p>
          ) : (
            <p>Drag & drop an image here, or click to select one</p>
          )}
        </div>
        
        {preview && !uploading && (
          <div className="preview" onClick={handleUpload}>
            <img src={preview} alt="Preview" />
          </div>
        )}
        
        {uploadStatus && (
          <div className={`status ${uploadStatus.type}`}>
            {uploadStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage, storeLatestImageUrl } from '../services/imageService';

const ImageUploader = ({ onImageUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const resetUploader = () => {
    setFile(null);
    setPreview(null);
    setUploadStatus(null);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setIsSelecting(false);
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

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    noClick: !!file, // Disable click when file is selected
    noKeyboard: !!file // Disable keyboard when file is selected
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
      
      // Reset the uploader immediately
      resetUploader();
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
        {!file ? (
          // Step 1: Show dropzone when no file is selected
          <div 
            {...getRootProps({ 
              className: `dropzone ${isSelecting ? 'selecting' : ''}`
            })}
          >
            <input {...getInputProps({
              onFocus: () => setIsSelecting(true),
              onBlur: () => setTimeout(() => setIsSelecting(false), 300)
            })} />
            {isSelecting ? (
              <div className="selecting-status">
                <p>Opening file picker...</p>
                <span className="loading"></span>
              </div>
            ) : isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Drag & drop an image here, or click to select one</p>
            )}
          </div>
        ) : (
          // Step 2: Show preview and upload button when file is selected
          <div className="file-selected-container">
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <button 
                className="change-image-btn" 
                onClick={() => {
                  if (!uploading) {
                    resetUploader();
                  }
                }}
                disabled={uploading}
              >
                Change
              </button>
            </div>
            
            <button 
              className={`upload-btn ${file ? 'gentle' : ''}`}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  Uploading... <span className="loading"></span>
                </>
              ) : (
                'Upload Image'
              )}
            </button>
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

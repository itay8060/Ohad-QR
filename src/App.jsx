import React, { useState, useEffect } from 'react';
import QRCodeComponent from './components/QRCode';
import ImageUploader from './components/ImageUploader';
import Modal from './components/Modal';
import { getLatestImageUrl, getLastUpdatedTimestamp, getDeleteImageUrl, deleteImage } from './services/imageService';

const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [deleteUrl, setDeleteUrl] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  useEffect(() => {
    // Get the latest image URL from localStorage
    const storedImageUrl = getLatestImageUrl();
    if (storedImageUrl) {
      setImageUrl(storedImageUrl);
      
      // Get the delete URL
      const storedDeleteUrl = getDeleteImageUrl();
      console.log('Delete URL from localStorage:', storedDeleteUrl);
      if (storedDeleteUrl) {
        setDeleteUrl(storedDeleteUrl);
      }
      
      // Get the last updated timestamp
      const timestamp = getLastUpdatedTimestamp();
      if (timestamp) {
        setLastUpdated(timestamp);
      }
    }
  }, []);

  const handleImageUpload = (url, delUrl) => {
    console.log('Image uploaded with URL:', url);
    console.log('Delete URL received:', delUrl);
    setImageUrl(url);
    setDeleteUrl(delUrl);
    setLastUpdated(new Date());
  };

  const handleDeleteImage = async () => {
    if (deleteUrl) {
      // Try to delete the image in the background
      await deleteImage(deleteUrl);
      
      // Clear local storage and state
      localStorage.removeItem('latestImageUrl');
      localStorage.removeItem('deleteImageUrl');
      localStorage.removeItem('lastUpdated');
      setImageUrl('');
      setDeleteUrl('');
      setLastUpdated(null);
    }
  };

  const openQRModal = () => {
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>QR Image Uploader</h1>
        <p>Upload an image and share it via QR code</p>
      </div>
      
      <div className="main-content">
        {imageUrl ? (
          <div className="current-image-container">
            <div className="current-image">
              <img src={imageUrl} alt="Current shared" />
            </div>
            <div className="actions">
              <button className="primary-btn" onClick={openQRModal}>
                Show QR Code
              </button>
              <button className="secondary-btn" onClick={() => window.open(imageUrl, '_blank')}>
                View Image
              </button>
              <button 
                className="danger-btn" 
                onClick={handleDeleteImage}
                style={{ display: 'block' }}
              >
                Delete Image
              </button>
            </div>
          </div>
        ) : (
          <div className="no-image-message">
            <p>No image uploaded yet. Upload an image to get started.</p>
          </div>
        )}
        
        <div className="upload-section-container">
          <ImageUploader onImageUpload={handleImageUpload} />
        </div>
      </div>
      
      {/* QR Code Modal */}
      <Modal 
        isOpen={showQRModal} 
        onClose={closeQRModal}
      >
        <div className="qr-modal-content">
          <QRCodeComponent url={imageUrl} size={300} />
        </div>
      </Modal>
    </div>
  );
};

export default App;

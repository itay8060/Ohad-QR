import React, { useState, useEffect } from 'react';
import QRCodeComponent from './components/QRCode';
import ImageUploader from './components/ImageUploader';
import Modal from './components/Modal';
import { getLatestImageUrl, getLastUpdatedTimestamp } from './services/imageService';

const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  useEffect(() => {
    // Get the latest image URL from localStorage
    const storedImageUrl = getLatestImageUrl();
    if (storedImageUrl) {
      setImageUrl(storedImageUrl);
      
      // Get the last updated timestamp
      const timestamp = getLastUpdatedTimestamp();
      if (timestamp) {
        setLastUpdated(timestamp);
      }
    }
  }, []);

  const handleImageUpload = (url) => {
    setImageUrl(url);
    setLastUpdated(new Date());
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
        <h1>QR Image Updater</h1>
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
        title="Share Your Image"
      >
        <div className="qr-modal-content">
          <QRCodeComponent url={imageUrl} size={300} />
        </div>
      </Modal>
    </div>
  );
};

export default App;

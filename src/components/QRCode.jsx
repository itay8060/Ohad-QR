import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeComponent = ({ url, size = 250 }) => {
  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="qr-display">
      <div className="qr-container">
        <QRCodeCanvas
          id="qr-code"
          value={url || 'https://example.com'}
          size={size}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      <div className="qr-info">
        <p>Scan to view the image directly</p>
        <button onClick={downloadQRCode} className="download-btn">
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeComponent;

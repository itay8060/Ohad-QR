import React, { useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeComponent = ({ url, size = 250 }) => {
  const qrRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (qrRef.current && canvasRef.current) {
      const qrCanvas = qrRef.current.querySelector('canvas');
      if (qrCanvas) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size with padding
        const padding = 40;
        canvas.width = qrCanvas.width + padding * 2;
        canvas.height = qrCanvas.height + padding * 2;
        
        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw gradient border
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#6a11cb');
        gradient.addColorStop(1, '#2575fc');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
        
        // Draw QR code in the center
        ctx.drawImage(qrCanvas, padding, padding);
        
        // Add text
        ctx.font = '14px Poppins, sans-serif';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Scan to view the image', canvas.width / 2, canvas.height - 15);
      }
    }
  }, [url, size]);

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="qr-display">
      <div className="qr-container" ref={qrRef}>
        <QRCodeCanvas
          id="qr-code"
          value={url || 'https://example.com'}
          size={size}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }} 
          width={size + 80} 
          height={size + 80}
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

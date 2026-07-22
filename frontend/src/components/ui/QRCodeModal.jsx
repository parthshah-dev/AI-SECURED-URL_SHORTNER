import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const QRCodeModal = ({ isOpen, onClose, shortCode }) => {
  const qrCodeUrl = `http://localhost:8080/api/qr/${shortCode}`;

  const handleDownload = () => {
    fetch(qrCodeUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `qrcode-${shortCode}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('Failed to download QR code'));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code">
      <div className="flex flex-col items-center justify-center p-4 space-y-6">
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <img 
            src={qrCodeUrl} 
            alt={`QR Code for ${shortCode}`} 
            className="w-48 h-48"
            crossOrigin="anonymous"
          />
        </div>
        
        <p className="text-sm text-neutral-500 text-center">
          Scan this QR code to visit the shortened URL directly.
        </p>

        <Button onClick={handleDownload} icon={faDownload} className="w-full">
          Download PNG
        </Button>
      </div>
    </Modal>
  );
};

export default QRCodeModal;

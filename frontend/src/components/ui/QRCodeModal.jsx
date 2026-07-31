import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Download, Share2 } from 'lucide-react';

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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `QR Code for /${shortCode}`,
        text: `Scan this QR code to visit the shortened URL`,
        url: `http://localhost:8080/${shortCode}`,
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`http://localhost:8080/${shortCode}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* QR Preview */}
        <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80">
          <img 
            src={qrCodeUrl} 
            alt={`QR Code for ${shortCode}`} 
            className="w-52 h-52"
            crossOrigin="anonymous"
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-800">/{shortCode}</p>
          <p className="text-xs text-neutral-500 mt-1">
            Scan this QR code to visit the shortened URL directly.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full">
          <Button onClick={handleDownload} icon={Download} className="flex-1">
            Download PNG
          </Button>
          <Button onClick={handleShare} icon={Share2} variant="secondary" className="flex-1">
            Share
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeModal;

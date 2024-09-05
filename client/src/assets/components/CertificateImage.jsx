import React, { useState } from 'react';
import './certificate.css'; // Import the CSS file

function CertificateImage({ certificateImage }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className='certificateImage'>
      {/* Thumbnail Image */}
      <img 
        className='certificate-thumbnail' 
        src={certificateImage}  
        onClick={openModal}
        alt="Certificate" 
      />

      {/* Certificate-Modal   */}
      {isOpen && (
        <div className="modal">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
					<a  onClick={closeModal}>
					<img 
              src={certificateImage} 
              className="modal-image" 
              alt="Certificate in Modal" 
            />
					</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateImage;

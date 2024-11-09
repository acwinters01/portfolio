import React from 'react';

const PlaylistModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose} id='playlistModal'>Close</button>
      </div>
    </div>
  );
};

export default PlaylistModal;

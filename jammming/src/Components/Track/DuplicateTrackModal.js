import React from 'react';
import '../App/App.css'

const DuplicateTrackModal = ({track, onConfirm, onCancel }) => {
    if (!track) return null;

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <p><span>{`${track.name}`}</span> by <span>{`${track.artist}`}</span> is already in the playlist.</p>
                <p id='question'>Do you want to add it again?</p>
                <div className='modal-buttons'>
                    <button onClick={() => onConfirm(track)}>Add Again</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>     
    );
};

export default DuplicateTrackModal;
import React from 'react';

export default function PagesSetUp({ playlistIndex, playlistPages, totalPages, goToNextPage, goToPreviousPage }) {
    return (
        <div className="pagination">
            <button 
                onClick={() => goToPreviousPage(playlistIndex)} 
                disabled={playlistPages[playlistIndex] === 0}
            >
                Previous
            </button>

            <span>{`Page ${playlistPages[playlistIndex] + 1} of ${totalPages}`}</span>

            <button 
                onClick={() => goToNextPage(playlistIndex)} 
                disabled={playlistPages[playlistIndex] >= totalPages - 1}
            >
                Next
            </button>
        </div>
    );
}

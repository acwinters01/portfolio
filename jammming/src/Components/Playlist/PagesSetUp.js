import React from 'react';

export default function PagesSetUp({ currentPage, totalPages, goToNextPage, goToPreviousPage }) {
    return (
        <div className="pagination">
            <button 
                onClick={goToPreviousPage} 
                disabled={currentPage === 0}
            >
                Previous
            </button>

            <span>{`Page ${currentPage + 1} of ${totalPages}`}</span>

            <button 
                onClick={goToNextPage} 
                disabled={currentPage >= totalPages - 1}
            >
                Next
            </button>
        </div>
    );
}

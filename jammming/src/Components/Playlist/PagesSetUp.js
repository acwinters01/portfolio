import React, {useState, useEffect} from 'react';

export default function PagesSetUp({ setCurrentPage, currentPage, totalPages, goToNextPage, goToPreviousPage }) {
    const [newPage, setNewPage] = useState(currentPage + 1);
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
      setNewPage(currentPage + 1);
    }, [currentPage]);

    const handleInputPageChange = (e) => {
        setNewPage(Number(e.target.value));
    }
    const handleInputPageSave = () => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage - 1); // Convert 1-based to 0-based index
        } else if (newPage > totalPages) {
            console.log('New page is greater than total')
            setCurrentPage(totalPages-1)
        } else if (newPage < 0) {
            setCurrentPage(0)
        } else {
            setNewPage(currentPage + 1); // Reset input if out of range
        }
        setIsEditing(false)
    }

    const handlePageClick = () => {
        setIsEditing(true);
    };

    return (
        <div className="pagination">
            <button 
                onClick={goToPreviousPage} 
                disabled={currentPage === 0}
            >
                Previous
            </button>

            {isEditing ? (
                <input
                    type="number"
                    value={newPage}
                    onChange={handleInputPageChange}
                    onBlur={handleInputPageSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleInputPageSave()}
                    autoFocus
                    style={{ width: '3em', textAlign: 'center' }}
                />
            ) : (
                <p>{`Page `}
                    <span 
                        onClick={handlePageClick} 
                        style={{ cursor: 'pointer' }}>
                            {`${currentPage + 1}`}
                    </span>
                    {` of ${totalPages} `}
                </p>
            )}

            <button 
                onClick={goToNextPage} 
                disabled={currentPage >= totalPages - 1}
            >
                Next
            </button>
        </div>
    );
}

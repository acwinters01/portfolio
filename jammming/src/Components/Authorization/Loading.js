import React from 'react';
import '../App/App.css'

const Loading = ({ isLoading }) => {

    return (

        <div className='modal-loading'>
            <div className='modal-overlay'>
                <div className='modal-content'>
                    <p>Loading...</p>
                </div>
            </div>
        </div>     
    );
};

export default Loading;
import React from 'react';
import './Loading.css'; // Import your CSS file

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
        </div>
    );
};

export default Loading;

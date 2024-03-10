import React from 'react';

function ScreenViewer({ imageSrc, isLoading }) {
    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <p>{imageSrc && <img id="uploaded-image" src={imageSrc} alt="Uploaded" style={{ maxWidth: "25%", maxHeight: "25%" }} />}</p>
            )}
        </div>
    );
}

export default ScreenViewer;
import React from 'react';

function ScreenViewer({ imageSrc, isLoading }) {
    const handleMouseMove = (event) => {
        const imgElement = document.getElementById('uploaded-image');
        const scaleX = imgElement.naturalWidth / imgElement.offsetWidth;
        const scaleY = imgElement.naturalHeight / imgElement.offsetHeight;

        const realX = Math.round(event.nativeEvent.offsetX * scaleX);
        const realY = Math.round(event.nativeEvent.offsetY * scaleY);
        alert(`input tap ${realX} ${realY}`);
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <p>{imageSrc && <img id="uploaded-image" src={imageSrc} alt="Uploaded" style={{ maxWidth: "25%", maxHeight: "25%" }} onClick={handleMouseMove} />}</p>
            )}
        </div>
    );
}

export default ScreenViewer;
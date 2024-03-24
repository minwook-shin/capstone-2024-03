import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window;

function ScreenViewer() {
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        ipcRenderer.send("screen");
        ipcRenderer.on("refresh", () => {
            ipcRenderer.send("screen");
        });
        ipcRenderer.on("screen", (_, args) => {
            const blob = new Blob([args.screen], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            setImageSrc(url);
            setIsLoading(false);
        });
    }, []);
    const handleMouseMove = (event) => {
        const imgElement = document.getElementById('uploaded-image');
        const scaleX = imgElement.naturalWidth / imgElement.offsetWidth;
        const scaleY = imgElement.naturalHeight / imgElement.offsetHeight;

        const realX = Math.round(event.nativeEvent.offsetX * scaleX);
        const realY = Math.round(event.nativeEvent.offsetY * scaleY);
        alert(`input tap ${realX} ${realY}`);
    };

    const handleButtonReload = () => {
        ipcRenderer.send("screen");
    };

    return (
        <div>
            <button onClick={handleButtonReload}>refresh Screen</button><br />
            {isLoading ? (
                <label>Loading...</label>
            ) : (
                <label>{imageSrc && <img id="uploaded-image" src={imageSrc} alt="Uploaded" style={{ maxWidth: "25%", maxHeight: "25%" }} onClick={handleMouseMove} />}</label>
            )}
        </div>
    );
}

export default ScreenViewer;
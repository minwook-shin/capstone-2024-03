import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window;

function ScreenViewer() {
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);


    const handleMouseDown = (event) => {
        const coords = getRealXY(event);
        setDragStart(coords);
        setIsDragging(true);
    };

    const handleMouseUp = (event) => {
        if (!isDragging) return;
        const coords = getRealXY(event);
        setDragEnd(coords);
        setIsDragging(false);
        alert(`Dragged from ${dragStart.x}, ${dragStart.y} to ${coords.x}, ${coords.y}`);
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        const coords = getRealXY(event);
        setDragEnd(coords);
    };

    const getRealXY = (event) => {
        const imgElement = document.getElementById('uploaded-image');
        const scaleX = imgElement.naturalWidth / imgElement.offsetWidth;
        const scaleY = imgElement.naturalHeight / imgElement.offsetHeight;

        const realX = Math.round(event.nativeEvent.offsetX * scaleX);
        const realY = Math.round(event.nativeEvent.offsetY * scaleY);
        return { x: realX, y: realY };
    };

    useEffect(() => {
        setIsLoading(true);
        ipcRenderer.send("screen");
        ipcRenderer.on("screen", (_, args) => {
            const blob = new Blob([args.screen], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            setImageSrc(url);
            setIsLoading(false);
        });
    }, []);

    const handleButtonReload = () => {
        ipcRenderer.send("screen");
    };

    return (
        <div>
            <button onClick={handleButtonReload}>refresh Screen</button><br />
            {isLoading ? (
                <label>Loading...</label>
            ) : (
                <label>{imageSrc && <img id="uploaded-image" src={imageSrc} alt="Uploaded" style={{ maxWidth: "25%", maxHeight: "25%" }} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} />}</label>
            )}
        </div>
    );
}

export default ScreenViewer;
import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";

const { ipcRenderer } = window;

/**
 * 화면 캡쳐 요청 함수
 * 버튼 클릭 시 ipcRenderer로 screen 이벤트 전송
 */
export const handleButtonReload = () => {
  ipcRenderer.send("screen");
};

function ScreenViewer({ setDragCoords, setClickCoords, className }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  /**
   * 마우스 이벤트 핸들러
   * 드래그 시작 좌표를 설정
   * @param {*} event 
   */
  const handleMouseDown = (event) => {
    const coords = getRealXY(event);
    setDragStart(coords);
    setIsDragging(true);
  };

  /**
   * 마우스 이벤트 핸들러
   * 드래그 종료 좌표를 설정하고, 좌표 알림창을 띄움
   * @param {*} event 
   * @returns 
   */
  const handleMouseUp = async (event) => {
    if (!isDragging) return;
    const coords = getRealXY(event);
    setDragEnd(coords);
    setIsDragging(false);
    setDragCoords({
      top_left_x: dragStart.x,
      top_left_y: dragStart.y,
      bottom_right_x: coords.x,
      bottom_right_y: coords.y,
    });
    setClickCoords({ x: dragStart.x, y: dragStart.y });
    setAlertOpen(true);
  };

  /**
   * 알림창을 닫는 함수
   * @param {*} event 
   * @param {*} reason 
   * @returns 
   */
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  /**
   * 마우스 이벤트 핸들러
   * 드래그 중일 때 드래그 종료 좌표를 설정
   * @param {*} event 
   * @returns 
   */
  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const coords = getRealXY(event);
    setDragEnd(coords);
  };

   /**
    * 좌표를 실제 안드로이드 화면 크기에 맞게 변환하는 함수
    * @param {*} event 
    * @returns 
    */
  const getRealXY = (event) => {
    const imgElement = document.getElementById("uploaded-image");
    const scaleX = imgElement.naturalWidth / imgElement.offsetWidth;
    const scaleY = imgElement.naturalHeight / imgElement.offsetHeight;

    const realX = Math.round(event.nativeEvent.offsetX * scaleX);
    const realY = Math.round(event.nativeEvent.offsetY * scaleY);
    return { x: realX, y: realY };
  };

  // 화면 캡쳐 요청 및 화면 이미지 업데이트
  useEffect(() => {
    setIsLoading(true);
    ipcRenderer.send("screen");
    ipcRenderer.on("screen", (_, args) => {
      const blob = new Blob([args.screen], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
      setIsLoading(false);
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div>
        {isLoading ? (
          <LinearProgress color="inherit" />
        ) : (
          <label className={className}>
            {imageSrc && (
              <img
                id="uploaded-image"
                src={imageSrc}
                alt="스마트폰이 인식되지 않습니다."
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              />
            )}
          </label>
        )}
      </div>
      {alertOpen && (
        <Alert onClose={handleClose} severity="success">
          저장된 좌표 : {dragStart.x}, {dragStart.y} to {dragEnd.x}, {dragEnd.y}
        </Alert>
      )}
    </div>
  );
}

export default ScreenViewer;

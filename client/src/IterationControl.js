import React from 'react';

function IterationControl({ repeatCount, setRepeatCount, currentCount, isPlaying }) {
    return (
        <div>
            <div>
                <label>총 반복 횟수 : </label>
                <input
                    type="number"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(e.target.value)}
                />
            </div>
            <div>
                <label>현재 진행 중인 반복 횟수 : {currentCount}</label>
            </div>
            <div>
            <label>{isPlaying ? "재생하는 중..." : "시나리오 실행 대기하는 중..."}</label>
            </div>
        </div>
    );
}

export default IterationControl;
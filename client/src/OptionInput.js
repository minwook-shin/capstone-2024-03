import React, { useEffect, useState } from 'react';
import { TextField, Select, MenuItem, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

function OptionInput({ inputValues, onInputChange, onInputConfirm, onInputCancel }) {
    const [keyEvents, setKeyEvents] = useState({});

    useEffect(() => {
        const loadKeyEvents = async () => {
            const response = await fetch('./key_event.json');
            const data = await response.json();
            setKeyEvents(data.key_events);
        };

        loadKeyEvents();
    }, []);

    return (
        <>
            {Object.keys(inputValues).map((key) => {
                if (key === 'text') { return null; }
                if (key === 'display_text') { return (<Box padding={1} sx={{ color: 'grey.500', justifyContent: 'center' }}><Typography> {inputValues[key]} 값을 설정하는 중...</Typography></Box>); }
                if (key === 'key_event') {
                    return (
                        <Select fullWidth
                            key={key}
                            name={key}
                            value={inputValues[key]}
                            onChange={onInputChange}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    onInputConfirm();
                                }
                                else if (event.key === 'Escape') {
                                    onInputCancel();
                                }
                            }}
                        >
                            {Object.entries(keyEvents).map(([eventKey, eventValue]) => (
                                <MenuItem key={eventKey} value={eventValue}>
                                    {eventKey}
                                </MenuItem>
                            ))}
                        </Select>
                    );
                }
                if (key === 'template') {
                    return (
                        <TextField fullWidth
                            label={key}
                            key={key}
                            type="file"
                            name={key}
                            onChange={onInputChange}
                            placeholder={`${key} 값을 입력하세요.`}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    onInputConfirm();
                                }
                                else if (event.key === 'Escape') {
                                    onInputCancel();
                                }
                            }}
                            sx={{ my: 0.5 }}
                        />
                    );
                }
                else if (key === 'functions') {
                    return (
                        <TextField
                            multiline
                            InputProps={{
                                rows: 3,
                                multiline: true,
                                inputComponent: 'textarea'
                            }}
                            style={{ width: '100%' }}
                            key={key}
                            name={key}
                            label={key}
                            value={inputValues[key]}
                            onChange={onInputChange}
                            placeholder='여기에 Drag & drop 하고, 다음과 같이 목록을 만드세요 : [{"text": "scroll_down", "time": "2"}, ...]'
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    onInputConfirm();
                                }
                                else if (event.key === 'Escape') {
                                    onInputCancel();
                                }
                            }}
                        />
                    );
                }
                else if (key === 'code') {
                    return (
                        <Tooltip title="텍스트 마지막에 'return'이 존재할 때만 Enter를 눌러 입력을 완료할 수 있습니다." placement="right-start" arrow>
                            <TextField fullWidth
                                style={{ width: '100%' }}
                                key={key}
                                name={key}
                                label={key}
                                value={inputValues[key]}
                                onChange={onInputChange}
                                placeholder="return로 끝낼 수 있는 파이썬 코드를 입력하세요."
                                helperText="변수 사용하기 : data = user_var; 변수 입력하기 : from flask import g; g.local['user_var'] = 'sample'; 완료하기: return"
                                onKeyDown={event => {
                                    if (event.key === 'Enter') {
                                        if (inputValues[key].trim().endsWith('return')) {
                                            onInputConfirm();
                                        }
                                    }
                                    else if (event.key === 'Escape') {
                                        onInputCancel();
                                    }
                                }}
                                InputProps={{
                                    rows: 3,
                                    multiline: true,
                                    inputComponent: 'textarea'
                                }}
                            />
                        </Tooltip>
                    );
                }
                if (key === 'x' || key === 'y' || key === 'top_left_x' || key === 'top_left_y' || key === 'bottom_right_x' || key === 'bottom_right_y') {
                    return (
                        <Tooltip title="안드로이드 스크린을 누르거나, 드래그하여 좌표 값을 변경하세요." placement="right-start" arrow>
                            <TextField fullWidth
                                key={key}
                                type="text"
                                name={key}
                                label={key}
                                value={inputValues[key]}
                                onChange={onInputChange}
                                placeholder={`${key} 값을 입력하세요.`}
                                onKeyDown={event => {
                                    if (event.key === 'Enter') {
                                        onInputConfirm();
                                    }
                                    else if (event.key === 'Escape') {
                                        onInputCancel();
                                    }
                                }}
                                sx={{ my: 0.5 }}
                                disabled="true"
                            />
                        </Tooltip>
                    );
                }
                else {
                    return (
                        <TextField fullWidth
                            key={key}
                            type="text"
                            name={key}
                            label={key}
                            value={inputValues[key]}
                            onChange={onInputChange}
                            placeholder={`${key} 값을 입력하세요.`}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    onInputConfirm();
                                }
                                else if (event.key === 'Escape') {
                                    onInputCancel();
                                }
                            }}
                            sx={{ my: 0.5 }}
                        />
                    );
                }
            })}
        </>
    );
}

export default OptionInput;
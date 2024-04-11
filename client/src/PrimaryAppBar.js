import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import { handleButtonReload } from './ScreenViewer.js';
import { resetKeyboard, installKeyboard, DownloadScreenShot } from './ControlButtons.js';
import { handleClickShowManager } from './ManagerViewer.js';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';


import { useCallback, useState } from 'react';




export default function PrimaryAppBar({ className, setRun }) {
    async function fetchData(url, options = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }
    const [keyboardStatus, setKeyboardStatus] = useState(false);

    const checkKeyboard = useCallback(async () => {
        const BASE_URL = 'http://127.0.0.1';
        const jsonResponse = await fetchData(`${BASE_URL}/check_keyboard`);
        setKeyboardStatus(jsonResponse);
    }, []);


    const [anchorEl, setAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const DraggableArea = styled('div')({
        '-webkit-app-region': 'drag',
        flexGrow: 1,
        width: '100%',
        height: '100%'
    });

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id={menuId}
            keepMounted
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={installKeyboard}>ADB 키보드 설치</MenuItem>
            <MenuItem onClick={resetKeyboard}>ADB 키보드 제거</MenuItem>
            <MenuItem onClick={checkKeyboard}>ADB 키보드 설치 확인</MenuItem>
            <label>Keyboard Status: {keyboardStatus ? "True" : "False"}</label>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <DraggableArea>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                        >
                            Studio (Buzzni & Minwook)
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </DraggableArea>
                    <Box sx={{ display: 'flex' }} className={className}>
                        <Tooltip title="시나리오에서 스크린샷 내려받기">
                            <IconButton size="large" color="inherit" onClick={DownloadScreenShot}>
                                <CloudDownloadIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="시나리오에서 추출한 텍스트 결과보기">
                            <IconButton size="large" color="inherit" onClick={handleClickShowManager}>
                                <AssignmentIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="안드로이드 화면 새로고침">
                            <IconButton size="large" color="inherit" onClick={handleButtonReload}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="도움말 확인">
                            <IconButton size="large" color="inherit" onClick={() => setRun(true)}>
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>

                        <IconButton size="large" edge="end" onClick={handleProfileMenuOpen} color="inherit">
                            <AdbIcon />
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            onClick={() => window.close()}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
            {renderMenu}
        </Box>
    );
}
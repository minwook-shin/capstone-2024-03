import React from 'react';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { Box } from '@mui/material';

function IterationControl({ repeatCount, setRepeatCount, currentCount, isPlaying }) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <TextField fullWidth margin="dense"
                id="outlined-number"
                label="총 반복 횟수"
                type="number"
                value={repeatCount}
                variant="standard"
                onChange={(e) => setRepeatCount(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Badge badgeContent={currentCount} color="primary">
                {isPlaying ? <PlayCircleOutlineIcon fontSize="large" /> : <PauseCircleOutlineIcon fontSize="large" />}
            </Badge>
        </Box>
    );
}

export default IterationControl;
import React from "react";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import { Box, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";

function IterationControl({
  repeatCount,
  setRepeatCount,
  currentCount,
  isPlaying,
  handleStopIconClick,
}) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <TextField
        fullWidth
        margin="dense"
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
      <Tooltip
        title="작업이 실행하고 있으면 아이콘을 클릭하여 중지할 수 있습니다."
        placement="right-start"
        arrow
      >
        <Badge badgeContent={currentCount} color="primary">
          {isPlaying ? (
            <IconButton
              style={{ padding: 0, color: "inherit", background: "none" }}
              onClick={handleStopIconClick}
            >
              <PlayCircleOutlineIcon fontSize="large" />
            </IconButton>
          ) : (
            <IconButton
              style={{ padding: 0, color: "inherit", background: "none" }}
            >
              <PauseCircleOutlineIcon fontSize="large" />
            </IconButton>
          )}
        </Badge>
      </Tooltip>
    </Box>
  );
}

export default IterationControl;

import React from "react";
import { Button, Box, Typography, useTheme } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const Execute = ({ onExecute }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Execute Profile
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PlayArrowIcon />}
        onClick={onExecute}
        sx={{ boxShadow: "none" }}
      >
        Execute
      </Button>
    </Box>
  );
};

export default Execute;

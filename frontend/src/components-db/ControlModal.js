import React, { useState, useEffect } from 'react';
import {
  Typography, Modal, Button, Box, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MonacoEditor from '@monaco-editor/react';
import CoPilot from './CoPilot'

const ControlModal = ({ open, onClose, controlCode, onSave }) => {
  const [code, setCode] = useState(controlCode);

  useEffect(() => {
    setCode(controlCode); // Reset code when controlCode changes
  }, [controlCode]);

  const handleSave = () => {
    onSave(code);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box 
        sx={{
          width: '75%', 
          height: '75%', 
          margin: 'auto', 
          marginTop: '5%', 
          display: 'flex', 
          flexDirection: 'row',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          position: 'relative'
        }}
      >
        {/* Left Side - Code Editor */}
        <Box 
          sx={{
            width: '50%', 
            padding: 2, 
            borderRight: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Edit Control Code</Typography>
          <MonacoEditor
            height="calc(100% - 50px)"
            
            language="ruby"
            value={code}
            onChange={(newValue) => setCode(newValue)}
            theme="vs-light" // Theme for styling
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
          />
        </Box>

        {/* Right Side - AI Integration */}
        <Box 
          sx={{
            width: '50%', 
            padding: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>AI Integration</Typography>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <CoPilot onClose={onClose} />

          </Box>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave} 
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default ControlModal;

import MonacoEditor, { loader } from '@monaco-editor/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CoPilot from './CoPilot';

const ControlModal = ({ open, onClose, controlCode, onSave }) => {
  const [code, setCode] = useState(controlCode);

  useEffect(() => {
    setCode(controlCode); // Reset code when controlCode changes
  }, [controlCode, code]);

useEffect(() => {
  loader.init().then(monaco => {
    // Ensure this runs only once
    if (monaco.languages.getLanguages().some(lang => lang.id === 'ruby')) {
      monaco.languages.registerCompletionItemProvider('ruby', {
        provideCompletionItems: () => {
          const suggestions = [
            {
              label: 'control',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'control "my_control_id" do\n  impact 0.5\n  title "Control title"\n  desc "Control description"\n  tag "tag_name"\n  describe ... \nend',
              documentation: 'Defines a control block in InSpec.'
            },
            {
              label: 'describe',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'describe ... do\n  it { should ... }\nend',
              documentation: 'Starts a describe block in InSpec.'
            },
            {
              label: 'impact',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'impact 0.5',
              documentation: 'Sets the impact level for a control.'
            },
            {
              label: 'title',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'title "Control title"',
              documentation: 'Defines the title of the control.'
            },
            {
              label: 'desc',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'desc "Control description"',
              documentation: 'Defines the description of the control.'
            },
            {
              label: 'tag',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'tag "tag_name"',
              documentation: 'Adds a tag to the control.'
            },
          ];
          return { suggestions: suggestions };
        }
      });
    }
  });
}, []); // Empty dependency array ensures this effect runs only once


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
            language="ruby" // Use Ruby for default syntax highlighting
            value={code}
            onChange={(newValue) => setCode(newValue)}
            theme="vs-dark" // or 'vs-light' for a light theme
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

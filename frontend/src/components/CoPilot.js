import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { getCoPilotResponse } from '../api/api'; // Adjust the import path as needed
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CoPilot = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setOutput(''); // Clear output when tab changes
  };

  const getActionString = (index) => {
    switch (index) {
      case 0:
        return 'GENERATE_CODE';
      case 1:
        return 'ANALYZE_CODE';
      case 2:
        return 'EXPLAIN';
      default:
        return 'UNKNOWN_ACTION';
    }
  };

  const stripQuotes = (str) => {
    if (str.startsWith('"') && str.endsWith('"')) {
      return str.slice(1, -1);
    }
    return str;
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const action = getActionString(activeTab);
      const response = await getCoPilotResponse(action, input);
      setOutput(stripQuotes(response.response));
    } catch (error) {
      console.error('Error calling CoPilot API:', error);
      setOutput('Error generating response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="CoPilot Tabs">
        <Tab label="GENERATE CODE" />
        <Tab label="ANALYZE CODE" />
        <Tab label="EXPLAIN" />
      </Tabs>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 2 }}>
        <TextField
          multiline
          minRows={6}
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ marginBottom: 2 }}
          placeholder="Enter compliance description or code here..."
        />
        <Button variant="contained" onClick={handleGenerateCode} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Generate'}
        </Button>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Output:</Typography>
          <SyntaxHighlighter 
            language="ruby" 
            style={vscDarkPlus} 
            wrapLongLines={true}
            customStyle={{
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {stripQuotes(output)}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Box>
  );
};

export default CoPilot;
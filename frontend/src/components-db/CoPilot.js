import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { getCoPilotResponse } from "../api/api"; // Adjust the import path as needed
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const CoPilot = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setOutput(""); // Clear output when tab changes
  };

  const getActionString = (index) => {
    switch (index) {
      case 0:
        return "GENERATE_CODE";
      case 1:
        return "ANALYZE_CODE";
      case 2:
        return "EXPLAIN";
      default:
        return "UNKNOWN_ACTION";
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
      let output = response.response;

      // Remove ```ruby from the first line if it exists
      if (output.startsWith("```ruby\n")) {
        output = output.replace("```ruby\n", "");
      }

      if (output.endsWith("```")) {
        output = output.slice(0, -3);
      }

      setOutput(output);
    } catch (error) {
      console.error("Error calling CoPilot API:", error);
      setOutput("Error generating response");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="CoPilot Tabs"
      >
        <Tab label="GENERATE CODE" />
        <Tab label="ANALYZE CODE" />
        <Tab label="EXPLAIN" />
      </Tabs>
      <Box
        sx={{ display: "flex", flexDirection: "column", flex: 1, padding: 2 }}
      >
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
        <Button
          variant="contained"
          onClick={handleGenerateCode}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate"}
        </Button>
        {output && (
          <Box
            sx={{
              position: "relative",
              mt: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Output:
            </Typography>
            <Box
              sx={{
                position: "relative",
                backgroundColor: "#1E1E1E",
                borderRadius: "4px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 16px",
                  backgroundColor: "#252526",
                }}
              >
                <Typography variant="body2" sx={{ color: "#CCCCCC" }}>
                  script
                </Typography>
                <Button
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyToClipboard}
                  size="small"
                  sx={{ color: "#CCCCCC" }}
                >
                  Copy
                </Button>
              </Box>
              <Box sx={{ flex: 1, overflow: "auto" }}>
                <SyntaxHighlighter
                  language="ruby"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "16px",
                  }}
                  wrapLongLines={true}
                >
                  {stripQuotes(output)}
                </SyntaxHighlighter>
              </Box>
            </Box>
          </Box>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="Copied to clipboard"
        />
      </Box>
    </Box>
  );
};

export default CoPilot;

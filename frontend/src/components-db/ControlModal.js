import MonacoEditor, { loader } from "@monaco-editor/react";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CoPilot from "./CoPilot";

const ControlModal = ({ open, onClose, controlCode, onSave }) => {
  const [code, setCode] = useState(controlCode);

  useEffect(() => {
    if (controlCode) {
      setCode(controlCode);
    }
  }, [controlCode]);

  useEffect(() => {
    loader.init().then((monaco) => {
      if (monaco.languages.getLanguages().some((lang) => lang.id === "ruby")) {
        monaco.languages.registerCompletionItemProvider("ruby", {
          provideCompletionItems: () => {
            const suggestions = [
              {
                label: "control",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText:
                  'control "my_control_id" do\n  impact 0.5\n  title "Control title"\n  desc "Control description"\n  tag "tag_name"\n  describe ... \nend',
                documentation: "Defines a control block in InSpec.",
              },
              // ... other suggestions ...
            ];
            return { suggestions: suggestions };
          },
        });
      }
    });
  }, []);

  const handleSave = () => {
    onSave(code);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "75%",
          height: "75%",
          margin: "auto",
          marginTop: "5%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          {/* Left Side - Code Editor */}
          <Box
            sx={{
              width: "50%",
              padding: 2,
              borderRight: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Edit Control Code
            </Typography>
            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <MonacoEditor
                height="100%"
                language="ruby"
                value={code}
                onChange={(newValue) => setCode(newValue)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </Box>
          </Box>

          {/* Right Side - AI Integration */}
          <Box
            sx={{
              width: "50%",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              AI Integration
            </Typography>
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
              }}
            >
              <CoPilot onClose={onClose} />
            </Box>
          </Box>
        </Box>

        {/* Save Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ControlModal;

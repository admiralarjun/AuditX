import React, { useState, useEffect } from "react";
import MonacoEditor, { loader } from "@monaco-editor/react";
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ControlAddModal = ({ open, onClose, onAdd }) => {
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState("");
  const [code, setCode] = useState("");
  const [showNavigation, setShowNavigation] = useState(false);

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
              // ... (keep other suggestions from the original ControlModal)
            ];
            return { suggestions: suggestions };
          },
        });
      }
    });
  }, []);

  const handleSubmit = () => {
    onAdd({
      title,
      name,
      description,
      impact: parseFloat(impact),
      code,
    });
    // Reset form and close modal
    setTitle("");
    setName("");
    setDescription("");
    setImpact("");
    setCode("");
    setPage(1);
    onClose();
  };

  const handleNext = () => {
    if (page === 1) setPage(2);
  };

  const handlePrev = () => {
    if (page === 2) setPage(1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          padding: 0,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent
        sx={{
          padding: 4,
          backgroundColor: "#f5f5f5",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onMouseEnter={() => setShowNavigation(true)}
        onMouseLeave={() => setShowNavigation(false)}
      >
        {page === 1 ? (
          <>
            <Typography variant="h6" sx={{ marginBottom: 3 }}>
              Add New Control
            </Typography>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              label="Impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
              inputProps={{ step: 0.1 }}
            />
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ marginBottom: 3 }}>
              Control Code
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
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
          </>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
            opacity: showNavigation ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {page}
            <Typography
              component="span"
              variant="caption"
              sx={{ opacity: 0.5 }}
            >
              /2
            </Typography>
          </Typography>
          <Box>
            {page === 2 && (
              <IconButton onClick={handlePrev} size="small">
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
            )}
            {page === 1 && (
              <IconButton onClick={handleNext} size="small">
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            )}
            {page === 2 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ marginLeft: 1 }}
              >
                Add Control
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ControlAddModal;

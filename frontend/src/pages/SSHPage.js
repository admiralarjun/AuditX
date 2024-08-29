import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";

const SSHCredentialsPage = () => {
  const [credentials, setCredentials] = useState({
    ssh_username: "",
    ssh_ip: "",
    ssh_password: "",
  });
  const [pemFile, setPemFile] = useState(null);
  const [pemFileName, setPemFileName] = useState("Upload PEM File");
  const [allCredentials, setAllCredentials] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchAllCredentials();
  }, []);

  const fetchAllCredentials = async () => {
    try {
      axios.defaults.baseURL = "http://127.0.0.1:8000";
      const response = await axios.get("/ssh_creds/?skip=0&limit=100");
      setAllCredentials(response.data);
    } catch (error) {
      console.error("Error fetching SSH credentials:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handlePemFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPemFileName(file.name);
      setPemFile(file);
    }
  };

  const saveCredentials = async () => {
    const formData = new FormData();
    formData.append("ssh_username", credentials.ssh_username);
    formData.append("ssh_ip", credentials.ssh_ip);
    formData.append("ssh_password", credentials.ssh_password);
    if (pemFile) {
      formData.append("pem_file", pemFile);
    }

    try {
      axios.defaults.baseURL = "http://localhost:8000";
      const response = await axios.post("/ssh_creds/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        alert("SSH credentials saved successfully.");
        fetchAllCredentials();
        setCredentials({ ssh_username: "", ssh_ip: "", ssh_password: "" });
        setPemFileName("Upload PEM File");
        setPemFile(null);
      } else {
        alert("Failed to save SSH credentials.");
      }
    } catch (error) {
      console.error("Error saving SSH credentials:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        alert(
          `Failed to save SSH credentials. Error: ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert(
          "Failed to save SSH credentials. No response received from the server."
        );
      } else {
        console.error("Error setting up request:", error.message);
        alert(`Failed to save SSH credentials. Error: ${error.message}`);
      }
    }
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h4" gutterBottom>
          SSH Credentials
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            name="ssh_username"
            label="Username"
            variant="outlined"
            fullWidth
            value={credentials.ssh_username}
            onChange={handleChange}
          />
          <TextField
            name="ssh_ip"
            label="IP Address"
            variant="outlined"
            fullWidth
            value={credentials.ssh_ip}
            onChange={handleChange}
          />
          <TextField
            name="ssh_password"
            label="SSH Password"
            type="password"
            variant="outlined"
            fullWidth
            value={credentials.ssh_password}
            onChange={handleChange}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <input
              type="file"
              accept=".pem"
              onChange={handlePemFileChange}
              style={{ display: "none" }}
              id="pem-file-upload"
            />
            <label htmlFor="pem-file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AddCircleOutlineRoundedIcon />}
              >
                {pemFileName}
              </Button>
            </label>
            <Tooltip title="Save Credentials">
              <IconButton
                onClick={saveCredentials}
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#3949ab",
                  "&:hover": {
                    backgroundColor: "#5c6bc0",
                  },
                }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ position: "relative", marginTop: 3 }}>
        <IconButton
          onClick={() => handleScroll("left")}
          sx={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            padding: 2,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          {allCredentials.map((cred) => (
            <Card
              key={cred.id}
              sx={{
                minWidth: 200,
                flexShrink: 0,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" align="center">
                  {cred.ssh_username}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  {cred.ssh_ip}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        <IconButton
          onClick={() => handleScroll("right")}
          sx={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default SSHCredentialsPage;

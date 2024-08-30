import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ComputerIcon from "@mui/icons-material/Computer";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

// Custom styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: "#f0f4f8",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: "bold",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: 180,
  height: 180,
  borderRadius: theme.spacing(2),
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  flexShrink: 0,
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  "&::-webkit-scrollbar": { display: "none" },
  scrollbarWidth: "none",
  width: "100%",
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  zIndex: 1,
  transition: "opacity 0.3s ease-in-out",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
}));

const SSHCredentialsPage = () => {
  const [credentials, setCredentials] = useState({
    ssh_username: "",
    ssh_ip: "",
    ssh_password: "",
  });
  
  const [pemFile, setPemFile] = useState(null);
  const [pemFileName, setPemFileName] = useState("Upload PEM File");
  const [allCredentials, setAllCredentials] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      alert(`Failed to save SSH credentials. Error: ${error.message}`);
    }
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  const handleCardClick = (credential) => {
    setSelectedCredential(credential);
    setIsModalOpen(true);
  };

  const handleConnect = () => {
    // Implement connection logic here
    console.log("Connecting to:", selectedCredential);
    localStorage.setItem("selectedCredential", selectedCredential.id);
    localStorage.setItem("selectedCredentialType", "ssh");
    setIsModalOpen(false);
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#34495e", fontWeight: "bold" }}
        >
          SSH Credentials
        </Typography>
        <Box component="form" sx={{ display: "flex", flexDirection: "column" }}>
          <StyledTextField
            name="ssh_username"
            label="Username"
            variant="outlined"
            fullWidth
            value={credentials.ssh_username}
            onChange={handleChange}
          />
          <StyledTextField
            name="ssh_ip"
            label="IP Address"
            variant="outlined"
            fullWidth
            value={credentials.ssh_ip}
            onChange={handleChange}
          />
          <StyledTextField
            name="ssh_password"
            label="SSH Password"
            type="password"
            variant="outlined"
            fullWidth
            value={credentials.ssh_password}
            onChange={handleChange}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <input
              type="file"
              accept=".pem"
              onChange={handlePemFileChange}
              style={{ display: "none" }}
              id="pem-file-upload"
            />
            <label htmlFor="pem-file-upload">
              <StyledButton
                variant="outlined"
                component="span"
                startIcon={<AddIcon />}
                sx={{ color: "#3498db", borderColor: "#3498db" }}
              >
                {pemFileName}
              </StyledButton>
            </label>
            <StyledButton
              onClick={saveCredentials}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                backgroundColor: "#2ecc71",
                "&:hover": { backgroundColor: "#27ae60" },
              }}
            >
              Save
            </StyledButton>
          </Box>
        </Box>
      </StyledPaper>

      <Box sx={{ position: "relative", marginTop: 3 }}>
        <ScrollButton
          onClick={() => handleScroll("left")}
          sx={{ left: -20, opacity: isScrolling ? 1 : 0 }}
        >
          <ChevronLeftIcon />
        </ScrollButton>
        <ScrollContainer
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            padding: 2,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {allCredentials.map((cred) => (
            <StyledCard key={cred.id} onClick={() => handleCardClick(cred)}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    marginBottom: 1,
                  }}
                >
                  <ComputerIcon
                    sx={{ color: "#3498db", fontSize: 30, marginBottom: 1 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#34495e",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    {cred.ssh_username}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#7f8c8d",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                  }}
                >
                  {cred.ssh_ip}
                </Typography>
              </CardContent>
            </StyledCard>
          ))}
        </ScrollContainer>
        <ScrollButton
          onClick={() => handleScroll("right")}
          sx={{ right: -20, opacity: isScrolling ? 1 : 0 }}
        >
          <ChevronRightIcon />
        </ScrollButton>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isModalOpen}>
          <ModalContent>
            <Typography
              variant="h5"
              component="h2"
              sx={{ color: "#34495e", fontWeight: "bold", marginBottom: 2 }}
            >
              SSH Credential Details
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 1 }}>
              Username: {selectedCredential?.ssh_username}
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 2 }}>
              IP Address: {selectedCredential?.ssh_ip}
            </Typography>
            <StyledButton
              onClick={handleConnect}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#3498db",
                "&:hover": { backgroundColor: "#2980b9" },
              }}
            >
              Connect
            </StyledButton>
          </ModalContent>
        </Fade>
      </Modal>
    </StyledContainer>
  );
};

export default SSHCredentialsPage;

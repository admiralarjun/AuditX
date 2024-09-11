import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  Card,
  CardContent,
  Modal,
  Fade,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import axios from "axios";

// Custom styled components (reused from SSHCredentialsPage)
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

const WinRMPage = () => {
  const [credentials, setCredentials] = useState({
    winrm_username: "",
    winrm_password: "",
    winrm_hostname: "",
    winrm_port: 5986,
    use_ssl: true,
  });
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
      
      const response = await axios.get("/winrm_creds/");
      console.log("WinRM credentials:", response.data);
      setAllCredentials(response.data);
    } catch (error) {
      console.error("Error fetching WinRM credentials:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: name === "use_ssl" ? checked : value,
    }));
  };

  const saveCredentials = async () => {
    try {
      axios.defaults.baseURL = "http://127.0.0.1:8000";
      console.log("Saving WinRM credentials: ", credentials);
      const response = await axios.post("/winrm_creds/", credentials);

      if (response.data) {
        alert("WinRM credentials saved successfully.");
        fetchAllCredentials();
        setCredentials({
          winrm_username: "",
          winrm_password: "",
          winrm_hostname: "",
          winrm_port: 5986,
          use_ssl: true,
        });
      } else {
        alert("Failed to save WinRM credentials.");
      }
    } catch (error) {
      console.error("Error saving WinRM credentials:", error);
      alert(`Failed to save WinRM credentials. Error: ${error.message}`);
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
          WinRM Credentials
        </Typography>
        <Box component="form" sx={{ display: "flex", flexDirection: "column" }}>
          <StyledTextField
            name="winrm_username"
            label="Username"
            variant="outlined"
            fullWidth
            value={credentials.winrm_username}
            onChange={handleChange}
          />
          <StyledTextField
            name="winrm_password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={credentials.winrm_password}
            onChange={handleChange}
          />
          <StyledTextField
            name="winrm_hostname"
            label="Hostname"
            variant="outlined"
            fullWidth
            value={credentials.winrm_hostname}
            onChange={handleChange}
          />
          <StyledTextField
            name="winrm_port"
            label="Port"
            type="number"
            variant="outlined"
            fullWidth
            value={credentials.winrm_port}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={credentials.use_ssl}
                onChange={handleChange}
                name="use_ssl"
                color="primary"
              />
            }
            label="Use SSL"
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
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
        <ScrollContainer ref={scrollContainerRef}>
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
                  <DesktopWindowsIcon
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
                    {cred.winrm_username}
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
                  {cred.winrm_hostname}
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
              WinRM Credential Details
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 1 }}>
              Username: {selectedCredential?.winrm_username}
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 1 }}>
              Hostname: {selectedCredential?.winrm_hostname}
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 1 }}>
              Port: {selectedCredential?.winrm_port}
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 2 }}>
              Use SSL: {selectedCredential?.use_ssl ? "Yes" : "No"}
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

export default WinRMPage;

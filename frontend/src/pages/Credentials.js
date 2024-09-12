import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ComputerIcon from "@mui/icons-material/Computer";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  FormControlLabel,
  IconButton,
  Modal,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

// Styled components (reused and combined from both pages)
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

const CredentialsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [winrmCredentials, setWinrmCredentials] = useState({
    winrm_username: "",
    winrm_password: "",
    winrm_hostname: "",
    winrm_port: 5986,
    use_ssl: true,
  });
  const [sshCredentials, setSshCredentials] = useState({
    ssh_username: "",
    ssh_ip: "",
    ssh_password: "",
  });
  const [pemFile, setPemFile] = useState(null);
  const [pemFileName, setPemFileName] = useState("Upload PEM File");
  const [allWinrmCredentials, setAllWinrmCredentials] = useState([]);
  const [allSshCredentials, setAllSshCredentials] = useState([]);
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
      const winrmResponse = await axios.get("/winrm_creds/");
      const sshResponse = await axios.get("/ssh_creds/?skip=0&limit=100");
      setAllWinrmCredentials(winrmResponse.data);
      setAllSshCredentials(sshResponse.data);
    } catch (error) {
      console.error("Error fetching credentials:", error);
    }
  };

  const handleWinrmChange = (e) => {
    const { name, value, checked } = e.target;
    setWinrmCredentials((prev) => ({
      ...prev,
      [name]: name === "use_ssl" ? checked : value,
    }));
  };

  const handleSshChange = (e) => {
    const { name, value } = e.target;
    setSshCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handlePemFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPemFileName(file.name);
      setPemFile(file);
    }
  };

  const saveWinrmCredentials = async () => {
    try {
      axios.defaults.baseURL = "http://127.0.0.1:8000";
      const response = await axios.post("/winrm_creds/", winrmCredentials);
      if (response.data) {
        alert("WinRM credentials saved successfully.");
        fetchAllCredentials();
        setWinrmCredentials({
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

  const saveSshCredentials = async () => {
    const formData = new FormData();
    formData.append("ssh_username", sshCredentials.ssh_username);
    formData.append("ssh_ip", sshCredentials.ssh_ip);
    formData.append("ssh_password", sshCredentials.ssh_password);
    if (pemFile) {
      formData.append("pem_file", pemFile);
    }

    try {
      axios.defaults.baseURL = "http://127.0.0.1:8000";
      const response = await axios.post("/ssh_creds/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        alert("SSH credentials saved successfully.");
        fetchAllCredentials();
        setSshCredentials({ ssh_username: "", ssh_ip: "", ssh_password: "" });
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

  const [currentCredential, setCurrentCredential] = useState(null);

  const handleConnect = () => {
    setCurrentCredential(selectedCredential.id);
    console.log("Connecting to:", selectedCredential);
    localStorage.setItem("selectedCredential", selectedCredential.id);
    localStorage.setItem("selectedCredentialType", tabValue === 0 ? "winrm" : "ssh");
    setIsModalOpen(false);
  };

  const handleDisconnect = () => {
    setCurrentCredential(null);
    console.log("Disconnecting from:", selectedCredential);
    localStorage.removeItem("selectedCredential");
    localStorage.removeItem("selectedCredentialType");
    setIsModalOpen(false);
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={3}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
          sx={{ marginBottom: 3 }}
        >
          <Tab label="WinRM" />
          <Tab label="SSH" />
        </Tabs>

        {tabValue === 0 ? (
          <Box component="form" sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" gutterBottom sx={{ color: "#34495e", fontWeight: "bold" }}>
              WinRM Credentials
            </Typography>
            <StyledTextField
              name="winrm_username"
              label="Username"
              variant="outlined"
              fullWidth
              value={winrmCredentials.winrm_username}
              onChange={handleWinrmChange}
            />
            <StyledTextField
              name="winrm_password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={winrmCredentials.winrm_password}
              onChange={handleWinrmChange}
            />
            <StyledTextField
              name="winrm_hostname"
              label="Hostname"
              variant="outlined"
              fullWidth
              value={winrmCredentials.winrm_hostname}
              onChange={handleWinrmChange}
            />
            <StyledTextField
              name="winrm_port"
              label="Port"
              type="number"
              variant="outlined"
              fullWidth
              value={winrmCredentials.winrm_port}
              onChange={handleWinrmChange}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={winrmCredentials.use_ssl}
                  onChange={handleWinrmChange}
                  name="use_ssl"
                  color="primary"
                />
              }
              label="Use SSL"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <StyledButton
                onClick={saveWinrmCredentials}
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
        ) : (
          <Box component="form" sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" gutterBottom sx={{ color: "#34495e", fontWeight: "bold" }}>
              SSH Credentials
            </Typography>
            <StyledTextField
              name="ssh_username"
              label="Username"
              variant="outlined"
              fullWidth
              value={sshCredentials.ssh_username}
              onChange={handleSshChange}
            />
            <StyledTextField
              name="ssh_ip"
              label="IP Address"
              variant="outlined"
              fullWidth
              value={sshCredentials.ssh_ip}
              onChange={handleSshChange}
            />
            <StyledTextField
              name="ssh_password"
              label="SSH Password"
              type="password"
              variant="outlined"
              fullWidth
              value={sshCredentials.ssh_password}
              onChange={handleSshChange}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
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
                onClick={saveSshCredentials}
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
        )}
      </StyledPaper>

      <Box sx={{ position: "relative", marginTop: 3 }}>
        <ScrollButton
          onClick={() => handleScroll("left")}
          sx={{ left: -20, opacity: isScrolling ? 1 : 0 }}
        >
          <ChevronLeftIcon />
        </ScrollButton>
        <ScrollContainer ref={scrollContainerRef}>
          {(tabValue === 0 ? allWinrmCredentials : allSshCredentials).map((cred) => (
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
                  {tabValue === 0 ? (
                    <DesktopWindowsIcon sx={{ color: "#3498db", fontSize: 30, marginBottom: 1 }} />
                  ) : (
                    <ComputerIcon sx={{ color: "#3498db", fontSize: 30, marginBottom: 1 }} />
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#34495e",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    {tabValue === 0 ? cred.winrm_username : cred.ssh_username}
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
                  {tabValue === 0 ? cred.winrm_hostname : cred.ssh_ip}
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
              {tabValue === 0 ? "WinRM" : "SSH"} Credential Details
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 1 }}>
              Username: {tabValue === 0 ? selectedCredential?.winrm_username : selectedCredential?.ssh_username}
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 1 }}>
              {tabValue === 0 ? "Hostname" : "IP Address"}: {tabValue === 0 ? selectedCredential?.winrm_hostname : selectedCredential?.ssh_ip}
            </Typography>
            {tabValue === 0 && (
              <>
                <Typography sx={{ color: "#7f8c8d", marginBottom: 1 }}>
                  Port: {selectedCredential?.winrm_port}
                </Typography>
                <Typography sx={{ color: "#7f8c8d", marginBottom: 2 }}>
                  Use SSL: {selectedCredential?.use_ssl ? "Yes" : "No"}
                </Typography>
              </>
            )}
            {(selectedCredential && currentCredential === selectedCredential.id) ? (
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
            ) : (
              <StyledButton
                onClick={handleDisconnect}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#e74c3c",
                  "&:hover": { backgroundColor: "#2980b9" },
                }}
              >
              Disconnect
              </StyledButton>
            )}
           
          </ModalContent>
        </Fade>
      </Modal>
    </StyledContainer>
  );
};

export default CredentialsPage;
            
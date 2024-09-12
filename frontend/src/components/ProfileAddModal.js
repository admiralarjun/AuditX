import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid } from "@mui/material";
import { createProfile } from "../api/profileBackendApi";
import { getPlatforms } from "../api/platformApi";
import { getWinRMCreds } from "../api/winrmCredsApi";
import { getSSHCreds } from "../api/sshCredsApi";

const ProfileAddModal = ({ open, onClose, onProfileAdded }) => {
  const [profileData, setProfileData] = useState({
    platform_id: "",
    name: "",
    winrm_creds_id: null,
    ssh_creds_id: null,
  });
  
  const [platforms, setPlatforms] = useState([]);
  const [winrmCreds, setWinrmCreds] = useState([]);
  const [sshCreds, setSSHCreds] = useState([]);
  const [selectedCredType, setSelectedCredType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platformsResponse, winrmCredsResponse, sshCredsResponse] = await Promise.all([
          getPlatforms(),
          getWinRMCreds(),
          getSSHCreds()
        ]);
        setPlatforms(platformsResponse.data);
        setWinrmCreds(winrmCredsResponse.data);
        setSSHCreds(sshCredsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleCredTypeChange = (e) => {
    const credType = e.target.value;
    setSelectedCredType(credType);
    setProfileData({
      ...profileData,
      winrm_creds_id: null,
      ssh_creds_id: null,
    });
  };

  const handleCredChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
      [name === 'winrm_creds_id' ? 'ssh_creds_id' : 'winrm_creds_id']: null,
    });
  };

  const handleSubmit = async () => {
    try {
      const newProfile = await createProfile(profileData);
      onProfileAdded(newProfile);
      onClose();
    } catch (error) {
      console.error("Error adding profile:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        p: 4,
        backgroundColor: "white",
        borderRadius: 2,
        width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
        maxWidth: 800,
        margin: "auto",
        mt: { xs: 4, sm: 8 },
        mb: 4,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
      }}>
        <Typography variant="h6" gutterBottom>Add New Profile</Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Platform</InputLabel>
          <Select
            name="platform_id"
            value={profileData.platform_id}
            onChange={handleChange}
          >
            {platforms.map((platform) => (
              <MenuItem key={platform.id} value={platform.id}>
                {platform.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Name"
          name="name"
          value={profileData.name}
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Credential Type</InputLabel>
          <Select
            value={selectedCredType}
            onChange={handleCredTypeChange}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="winrm">WinRM</MenuItem>
            <MenuItem value="ssh">SSH</MenuItem>
          </Select>
        </FormControl>

        {selectedCredType === "winrm" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>WinRM Credentials</InputLabel>
            <Select
              name="winrm_creds_id"
              value={profileData.winrm_creds_id || ''}
              onChange={handleCredChange}
            >
              {winrmCreds.map((cred) => (
                <MenuItem key={cred.id} value={cred.id}>
                  {cred.winrm_username} - {cred.winrm_hostname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {selectedCredType === "ssh" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>SSH Credentials</InputLabel>
            <Select
              name="ssh_creds_id"
              value={profileData.ssh_creds_id || ''}
              onChange={handleCredChange}
            >
              {sshCreds.map((cred) => (
                <MenuItem key={cred.id} value={cred.id}>
                  {cred.ssh_username} - {cred.ssh_ip}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Add Profile
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfileAddModal;

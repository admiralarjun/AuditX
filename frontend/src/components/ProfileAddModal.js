import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPlatforms } from "../api/platformApi";
import { createProfile } from "../api/profileBackendApi";
import { getSSHCreds } from "../api/sshCredsApi";
import { getWinRMCreds } from "../api/winrmCredsApi";

const ProfileAddModal = ({ open, onClose, onProfileAdded }) => {
  const [profileData, setProfileData] = useState({
    platform_id: "",
    name: "",
    creds_type: "", // Track the credential type
    creds_id: null, // Single field to hold the selected credential ID
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
      creds_type: credType, // Set the credential type
      creds_id: credType === "none" ? null : "", // Reset creds_id when the type changes, or set to null for "none"
    });
  };

  const handleCredChange = (e) => {
    const { value } = e.target;
    setProfileData({
      ...profileData,
      creds_id: value, // Update creds_id when the user selects a credential
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
        <Typography variant="h6" gutterBottom>Add New Device</Typography>

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
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="winrm">WinRM</MenuItem>
            <MenuItem value="ssh">SSH</MenuItem>
          </Select>
        </FormControl>

        {/* Show credential selection only if the type is not "none" */}
        {selectedCredType === "winrm" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>WinRM Credentials</InputLabel>
            <Select
              name="creds_id" // Single field for creds_id
              value={profileData.creds_id || ''}
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
              name="creds_id" // Single field for creds_id
              value={profileData.creds_id || ''}
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
          Add Device
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfileAddModal;

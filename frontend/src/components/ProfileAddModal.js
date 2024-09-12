import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid } from "@mui/material";
import { createProfile } from "../api/profileBackendApi";
import { getPlatforms } from "../api/platformApi";

const ProfileAddModal = ({ open, onClose, onProfileAdded }) => {
  const [profileData, setProfileData] = useState({
    platform_id: "",
    name: "",
    winrm_creds_id: null,
    ssh_creds_id: null,
  });
  
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await getPlatforms();
        setPlatforms(response.data);
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
    };

    fetchPlatforms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
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

        <TextField
          label="WinRM Credentials ID"
          name="winrm_creds_id"
          value={profileData.winrm_creds_id || ''}
          fullWidth
          margin="normal"
          onChange={handleChange}
          type="number"
        />

        <TextField
          label="SSH Credentials ID"
          name="ssh_creds_id"
          value={profileData.ssh_creds_id || ''}
          fullWidth
          margin="normal"
          onChange={handleChange}
          type="number"
        />

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

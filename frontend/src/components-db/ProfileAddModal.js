import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, IconButton } from "@mui/material";
import { createProfile } from "../api/profileBackendApi";
import { getPlatforms } from "../api/platformApi";
import { AccountCircle, Info, Code, Description, Build, School, ListAlt, Copyright, Email } from "@mui/icons-material";

const ProfileAddModal = ({ open, onClose, onProfileAdded }) => {
  const [profileData, setProfileData] = useState({
    platform_id: "",
    name: "",
    version: "",
    path: "",
    title: "",
    maintainer: "",
    summary: "",
    license: "",
    copyright: "",
    copyright_email: "",
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
      onClose(); // Close the modal after successful profile addition
    } catch (error) {
      console.error("Error adding profile:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "white",
          borderRadius: 2,
          width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" }, // Responsive width
          maxWidth: 800, // Maximum width for larger screens
          margin: "auto",
          mt: { xs: 4, sm: 8 }, // Responsive top margin
          mb: 4, // Margin bottom
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add New Profile
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Platform</InputLabel>
              <Select
                name="platform_id"
                value={profileData.platform_id}
                onChange={handleChange}
                startAdornment={<AccountCircle />}
              >
                {platforms.map((platform) => (
                  <MenuItem key={platform.id} value={platform.id}>
                    {platform.name} {/* Adjust this based on your platform data */}
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
              InputProps={{ startAdornment: <Info /> }}
            />
            <TextField
              label="Version"
              name="version"
              value={profileData.version}
              fullWidth
              margin="normal"
              onChange={handleChange}
              InputProps={{ startAdornment: <Code /> }}
            />
            <TextField
              label="Path"
              name="path"
              value={profileData.path}
              fullWidth
              margin="normal"
              onChange={handleChange}
              InputProps={{ startAdornment: <Build /> }}
            />
            <TextField
              label="Title"
              name="title"
              value={profileData.title}
              fullWidth
              margin="normal"
              onChange={handleChange}
              InputProps={{ startAdornment: <Description /> }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Maintainer"
              name="maintainer"
              value={profileData.maintainer}
              fullWidth
              margin="normal"
              onChange={handleChange}
              InputProps={{ startAdornment: <School /> }}
            />
            <TextField
              label="Summary"
              name="summary"
              value={profileData.summary}
              fullWidth
              margin="normal"
              onChange={handleChange}
              InputProps={{ startAdornment: <ListAlt /> }}
            />
            <TextField
              label="License"
              name="license"
              value={profileData.license}
              fullWidth
              margin="normal"
              onChange={handleChange}
              InputProps={{ startAdornment: <Copyright /> }}
            />
            <TextField
              label="Copyright"
              name="copyright"
              value={profileData.copyright}
              fullWidth
              margin="normal"
              onChange={handleChange}
              InputProps={{ startAdornment: <Copyright /> }}
            />
            <TextField
              label="Copyright Email"
              name="copyright_email"
              value={profileData.copyright_email}
              fullWidth
              margin="normal"
              onChange={handleChange}
              InputProps={{ startAdornment: <Email /> }}
            />
          </Grid>
        </Grid>

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

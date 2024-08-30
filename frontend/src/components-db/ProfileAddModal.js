// ProfileAddModal.js
import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { createProfile } from "../api/profileBackendApi";

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
          width: { xs: "90%", sm: "80%", md: "60%", lg: "40%" }, // Responsive width
          maxWidth: 600, // Maximum width for larger screens
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

        {Object.keys(profileData).map((key) => (
          <TextField
            key={key}
            label={capitalizeFirstLetter(key.replace("_", " "))}
            name={key}
            value={profileData[key]}
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
        ))}

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

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default ProfileAddModal;

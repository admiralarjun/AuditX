// ProfileList.js
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getProfiles } from "../api/profileBackendApi";
import ProfileAddModal from "./ProfileAddModal";

const ProfileList = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getProfiles();
        setProfiles(Array.isArray(data) ? data : []);
        setError(null);
        if(data.length > 0) {
          setSelectedProfile(data[0]);
          onSelectProfile(data[0]);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError("Error fetching profiles. Please try again later.");
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [onSelectProfile]);

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    onSelectProfile(profile);
  };

  const handleAddProfile = (newProfile) => {
    setProfiles((prevProfiles) => [...prevProfiles, newProfile]);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, height: "100vh", display: "flex", flexDirection: "column", overflowX: "hidden", overflowY: "hidden" }}>
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>Devices</Typography>
      <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} sx={{ mb: 2 }}>
        Add New Device
      </Button>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : profiles.length === 0 ? (
        <Typography>No profiles available</Typography>
      ) : (
        <List sx={{ display: "flex", flexDirection: "column", gap: 1, height: "100%", padding: 0 }}>
          {profiles.map((profile) => (
            <ListItem
              button
              key={profile.id}
              onClick={() => handleProfileClick(profile)}
              sx={{
                backgroundColor: selectedProfile === profile ? "#c5cae9" : "inherit",
                "&:hover": { backgroundColor: "#e8eaf6" },
                borderRadius: 1,
                transition: "background-color 0.3s ease",
                marginRight: 2,
                padding: "8px 16px",
              }}
            >
              <ListItemText primary={profile.name} />
            </ListItem>
          ))}
        </List>
      )}
      <ProfileAddModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onProfileAdded={handleAddProfile}
      />
    </Paper>
  );
};

export default ProfileList;

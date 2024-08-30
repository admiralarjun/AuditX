import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getProfiles } from "../api/profileBackendApi";

const ProfileList = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await getProfiles();
        console.log(response.data);
        setProfiles(response.data || []); // Assuming the response.data is already the array of profiles
      } catch (error) {
        setError("Error fetching profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    onSelectProfile(profile);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
        Profiles
      </Typography>
      {profiles.length === 0 ? (
        <Typography>No profiles available</Typography>
      ) : (
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            height: "100%",
            padding: 0,
            overflowY: "auto",
          }}
        >
          {profiles.map((profile) => (
            <ListItem
              button
              key={profile.id}
              onClick={() => handleProfileClick(profile)}
              sx={{
                backgroundColor:
                  selectedProfile === profile ? "#c5cae9" : "inherit",
                "&:hover": {
                  backgroundColor: "#e8eaf6",
                },
                borderRadius: 1,
                transition: "background-color 0.3s ease",
                marginRight: 2,
                padding: "8px 16px",
              }}
            >
              <ListItemText
                primary={profile.name}
                secondary={`Version: ${profile.version} | Maintainer: ${profile.maintainer}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ProfileList;
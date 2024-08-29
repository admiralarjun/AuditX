import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getProfiles } from '../api/api';

const ProfileList = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await getProfiles();
        setProfiles(response.data.profiles || []); // Ensure profiles is an array
      } catch (error) {
        setError('Error fetching profiles');
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        Profiles
      </Typography>
      {profiles.length === 0 ? (
        <Typography>No profiles available</Typography>
      ) : (
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1, // Space between items
            height: '100%',
            padding: 0,
            overflowY: 'auto', // Scrollable if needed
          }}
        >
          {profiles.map((profile) => (
            <ListItem
              button
              key={profile}
              onClick={() => handleProfileClick(profile)}
              sx={{
                backgroundColor: selectedProfile === profile ? '#c5cae9' : 'inherit',
                '&:hover': {
                  backgroundColor: '#e8eaf6',
                },
                borderRadius: 1,
                transition: 'background-color 0.3s ease',
                marginRight: 2, // Right margin to add space
                padding: '8px 16px', // Adjust padding for better spacing
              }}
            >
              <ListItemText primary={profile} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ProfileList;

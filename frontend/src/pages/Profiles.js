import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getProfiles } from '../api/profileBackendApi';
import ControlsList from '../components/ControlsList';
import ProfileList from '../components/ProfileList';

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await getProfiles();
        setProfiles(response.data || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const handleAddProfile = (newProfile) => {
    setProfiles([...profiles, newProfile]);
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <ProfileList
        profiles={profiles}
        onSelectProfile={setSelectedProfile}
        onAddProfile={handleAddProfile}
      />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {selectedProfile && <ControlsList selectedProfile={selectedProfile} />}
      </Box>
    </Box>
  );
};

export default Profiles;

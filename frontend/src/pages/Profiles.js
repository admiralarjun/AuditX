import React, { useState } from 'react';
import ProfileList from '../components/ProfileList';
import ControlsList from '../components/ControlsList';
import { Container, Grid } from '@mui/material';

const Profiles = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ProfileList onSelectProfile={setSelectedProfile} />
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedProfile && <ControlsList profile={selectedProfile} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profiles;

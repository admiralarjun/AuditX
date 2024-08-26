import React, { useState } from 'react';
import ProfileList from '../components/ProfileList';
import ControlResult from '../components/ControlResult';
import { Container, Grid } from '@mui/material';

const Execute = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ProfileList onSelectProfile={setSelectedProfile} />
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedProfile && <ControlResult profile={selectedProfile} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Execute;

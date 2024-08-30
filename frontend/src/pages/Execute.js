import { Container, Grid } from '@mui/material';
import React, { useState } from 'react';
import ControlResult from '../components-db/ControlResultDB';
import ProfileListViaBackend from '../components-db/ProfileListViaBackend';
// import ControlResult from '../components/ControlResult';
// import ProfileList from '../components/ProfileList';

const Execute = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  console.log("selectedProfile", selectedProfile);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {/* <ProfileList onSelectProfile={setSelectedProfile} /> */}
          <ProfileListViaBackend onSelectProfile={setSelectedProfile} />
        </Grid>
        <Grid item xs={12} md={8}>
          {/* {selectedProfile && <ControlResult profile={selectedProfile} />} */}
          {selectedProfile && ( <ControlResult selectedProfile={selectedProfile} /> )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Execute;

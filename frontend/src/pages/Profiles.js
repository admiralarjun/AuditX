import { Container, Grid } from "@mui/material";
import React, { useState } from "react";
import ControlsListDB from "../components/ControlsList";
import ProfileListViaBackend from "../components/ProfileListViaBackend";
// import ControlsList from "../components/ControlsList";
// import ProfileList from "../components/ProfileList";

const Profiles = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {/* <ProfileList onSelectProfile={setSelectedProfile} /> */}
          <ProfileListViaBackend onSelectProfile={setSelectedProfile} />
        </Grid>
        <Grid item xs={12} md={8}>
          {/* {selectedProfile && <ControlsList profile={selectedProfile} />} */}
          {selectedProfile && (
            <ControlsListDB selectedProfile={selectedProfile} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profiles;

import React, { useState } from "react";
import ProfileList from "../components/ProfileList";
import ControlsList from "../components/ControlsList";
import ControlsListDB from "../components-db/ControlsList";
import ProfileListViaBackend from "../components-db/ProfileListViaBackend";
import { Container, Grid } from "@mui/material";

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
          {selectedProfile && (
            <ControlsListDB selectedProfile={selectedProfile} />
          )}
          {/* {selectedProfile && <ControlsList profile={selectedProfile} />} */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profiles;

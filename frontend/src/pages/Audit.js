import React, { useState } from "react";
import { Container, Grid, Tabs, Tab } from "@mui/material";
import ProfileListViaBackend from "../components/ProfileListViaBackend";
import ControlsListDB from "../components/ControlsList";
import ControlResult from "../components/ControlResult";

const ProfilesAndExecute = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Profiles" />
        <Tab label="Execute" />
      </Tabs>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ProfileListViaBackend onSelectProfile={setSelectedProfile} />
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedProfile && tabValue === 0 && (
            <ControlsListDB selectedProfile={selectedProfile} />
          )}
          {selectedProfile && tabValue === 1 && (
            <ControlResult selectedProfile={selectedProfile} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilesAndExecute;

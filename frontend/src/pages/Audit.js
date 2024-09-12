import { Box, Paper, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import ControlResult from "../components/ControlResult";
import ControlsList from "../components/ControlsList";
import ProfileList from "../components/ProfileList";

const Audit = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}> {/* Adjust 64px if your top bar height is different */}
      <Box sx={{ width: 300, borderRight: '1px solid rgba(0, 0, 0, 0.12)', overflowY: 'auto' }}>
        <ProfileList onSelectProfile={setSelectedProfile} />
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            minHeight: 'auto',
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              minHeight: 'auto',
              py: 1,
              px: 2,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              border: '1px solid',
              borderColor: 'divider',
              borderBottom: 'none',
              '&.Mui-selected': {
                bgcolor: '#f5f5f5',
                fontWeight: 'bold',
              },
            },
          }}
        >
          <Tab label="Profiles" />
          <Tab label="Audit" />
        </Tabs>
        <Paper sx={{ flexGrow: 1, overflowY: 'auto', borderRadius: 0 }}>
          {tabValue === 0 && selectedProfile && (
            <ControlsList selectedProfile={selectedProfile} />
          )}
          {tabValue === 1 && selectedProfile && (
            <ControlResult selectedProfile={selectedProfile} />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Audit;
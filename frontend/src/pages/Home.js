import React from 'react';
import { Typography, Container, Paper } from '@mui/material';

const Home = () => (
  <Container>
    <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h4">Welcome to AuditX</Typography>
      <Typography variant="body1">Use the navigation to access different features.</Typography>
    </Paper>
  </Container>
);

export default Home;

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, TextField, Box, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';

const Navbar = ({ onCredentialsChange = () => {} }) => {
  const [credentials, setCredentials] = useState({ username: '', ip: '', password: '' });

  useEffect(() => {
    const storedCredentials = localStorage.getItem('sshCredentials');
    if (storedCredentials) {
      setCredentials(JSON.parse(storedCredentials));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    onCredentialsChange({ ...credentials, [name]: value });
  };

  const saveCredentialsToLocalStorage = () => {
    localStorage.setItem('sshCredentials', JSON.stringify(credentials));
    alert('Credentials saved to local storage.');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a237e', padding: '0 16px' }}>
      <Toolbar>
        <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            AuditX
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              name="username"
              label="Username"
              variant="outlined"
              size="small"
              value={credentials.username}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#3949ab',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5c6bc0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7986cb',
                  },
                },
              }}
            />
            <TextField
              name="ip"
              label="IP Address"
              variant="outlined"
              size="small"
              value={credentials.ip}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#3949ab',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5c6bc0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7986cb',
                  },
                },
              }}
            />
            <TextField
              name="password"
              label="SSH Password"
              type="password"
              variant="outlined"
              size="small"
              value={credentials.password}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#3949ab',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5c6bc0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7986cb',
                  },
                },
              }}
            />
            <Tooltip title="Save Credentials">
              <IconButton
                onClick={saveCredentialsToLocalStorage}
                sx={{
                  color: '#ffffff',
                  backgroundColor: '#3949ab',
                  '&:hover': {
                    backgroundColor: '#5c6bc0',
                  },
                }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              sx={{ 
                fontWeight: 'bold', 
                textTransform: 'none', 
                color: '#ffffff', 
                '&:hover': { 
                  backgroundColor: '#3949ab' 
                } 
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/profiles" 
              sx={{ 
                fontWeight: 'bold', 
                textTransform: 'none', 
                color: '#ffffff', 
                '&:hover': { 
                  backgroundColor: '#3949ab' 
                } 
              }}
            >
              Profiles
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/execute" 
              sx={{ 
                fontWeight: 'bold', 
                textTransform: 'none', 
                color: '#ffffff', 
                '&:hover': { 
                  backgroundColor: '#3949ab' 
                } 
              }}
            >
              Execute
            </Button>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

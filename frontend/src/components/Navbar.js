import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SaveIcon from '@mui/icons-material/Save';
import { AppBar, Box, Button, Container, IconButton, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onCredentialsChange = () => {} }) => {
  const [credentials, setCredentials] = useState({ username: '', ip: '', password: '', pemFile: null });
  const [pemFileName, setPemFileName] = useState('Upload PEM File');
  
  useEffect(() => {
    const storedCredentials = localStorage.getItem('sshCredentials');
    const storedPemFileName = localStorage.getItem('pemFileName') || 'Upload PEM File';
    
    if (storedCredentials) {
      const parsedCredentials = JSON.parse(storedCredentials);
      setCredentials(parsedCredentials);
      setPemFileName(storedPemFileName);
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedCredentials = { ...credentials, [name]: value };
    setCredentials(updatedCredentials);
    onCredentialsChange(updatedCredentials);
  };

  const handlePemFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPemFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Pem = reader.result.split(',')[1];
        const updatedCredentials = { ...credentials, pemFile: base64Pem };
        setCredentials(updatedCredentials);
        onCredentialsChange(updatedCredentials);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCredentialsToLocalStorage = () => {
    localStorage.setItem('sshCredentials', JSON.stringify(credentials));
    localStorage.setItem('pemFileName', pemFileName);
    alert('Credentials and PEM file saved to local storage.');
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
              sx={textFieldStyles}
            />
            <TextField
              name="ip"
              label="IP Address"
              variant="outlined"
              size="small"
              value={credentials.ip}
              onChange={handleChange}
              sx={textFieldStyles}
            />
            <TextField
              name="password"
              label="SSH Password"
              type="password"
              variant="outlined"
              size="small"
              value={credentials.password}
              onChange={handleChange}
              sx={textFieldStyles}
            />
            <input
              type="file"
              accept=".pem"
              onChange={handlePemFileChange}
              style={{ display: 'none' }}
              id="pem-file-upload"
            />
            <label htmlFor="pem-file-upload">
              <Tooltip title={pemFileName}>
                <IconButton
                  component="span"
                  sx={{
                    color: '#ffffff',
                  }}
                >
                  <AddCircleOutlineRoundedIcon /> 
                </IconButton>
                <Button style={{ color: "orange" }}>{pemFileName}</Button>
              </Tooltip>
            </label>
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
              sx={buttonStyles}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/profiles"
              sx={buttonStyles}
            >
              Profiles
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/execute"
              sx={buttonStyles}
            >
              Execute
            </Button>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

const textFieldStyles = {
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
};

const buttonStyles = {
  fontWeight: 'bold',
  textTransform: 'none',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#3949ab',
  },
};

export default Navbar;

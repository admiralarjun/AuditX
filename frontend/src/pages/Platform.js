import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ComputerIcon from '@mui/icons-material/Computer';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Fade,
    IconButton,
    Modal,
    Paper,
    TextField,
    Typography,
    Select,
    MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Styled components (unchanged)
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: '#f0f4f8',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 'bold',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: 180,
  height: 180,
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  flexShrink: 0,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  width: '100%',
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  zIndex: 1,
  transition: 'opacity 0.3s ease-in-out',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
}));

const PlatformPage = () => {
  const [platform, setPlatform] = useState({
    name: '',
    release: '',
    target_id: '',
    winrm_creds_id: '',
    ssh_creds_id: '',
  });
  const [allPlatforms, setAllPlatforms] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [winrmCreds, setWinrmCreds] = useState([]);
  const [sshCreds, setSshCreds] = useState([]);
  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    fetchAllPlatforms();
    fetchWinRMCreds();
    fetchSSHCreds();
  }, []);

  const fetchAllPlatforms = async () => {
    try {
      axios.defaults.baseURL = 'http://127.0.0.1:8000';
      const response = await axios.get('/platforms/');
      setAllPlatforms(response.data);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  const fetchWinRMCreds = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/winrm_creds/');
      setWinrmCreds(response.data);
    } catch (error) {
      console.error('Error fetching WinRM credentials:', error);
    }
  };

  const fetchSSHCreds = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/ssh_creds/');
      setSshCreds(response.data);
    } catch (error) {
      console.error('Error fetching SSH credentials:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlatform((prev) => ({ ...prev, [name]: value }));
  };

  const savePlatform = async () => {
    try {
      axios.defaults.baseURL = 'http://localhost:8000';
      if (isEditMode) {
        await axios.put(`/platforms/${selectedPlatform.id}`, platform);
      } else {
        await axios.post('/platforms/', platform);
      }
      alert(`Platform ${isEditMode ? 'updated' : 'saved'} successfully.`);
      fetchAllPlatforms();
      setPlatform({ name: '', release: '', target_id: '', winrm_creds_id: '', ssh_creds_id: '' });
      setIsEditMode(false);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'saving'} platform:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'save'} platform. Error: ${error.message}`);
    }
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  const handleCardClick = (platform) => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setPlatform(selectedPlatform);
    setIsEditMode(true);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/platforms/${selectedPlatform.id}`);
      alert('Platform deleted successfully.');
      fetchAllPlatforms();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting platform:', error);
      alert(`Failed to delete platform. Error: ${error.message}`);
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom sx={{ color: '#34495e', fontWeight: 'bold' }}>
          {isEditMode ? 'Edit Platform' : 'Add New Platform'}
        </Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }}>
          <StyledTextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={platform.name}
            onChange={handleChange}
          />
          <StyledTextField
            name="release"
            label="Release"
            variant="outlined"
            fullWidth
            value={platform.release}
            onChange={handleChange}
          />
          <StyledTextField
            name="target_id"
            label="Target ID"
            variant="outlined"
            fullWidth
            value={platform.target_id}
            onChange={handleChange}
          />
          <Select
            name="winrm_creds_id"
            label="WinRM Credentials"
            value={platform.winrm_creds_id}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="">None</MenuItem>
            {winrmCreds.map((cred) => (
              <MenuItem key={cred.id} value={cred.id}>
                {cred.winrm_username} - {cred.winrm_hostname}
              </MenuItem>
            ))}
          </Select>
          <Select
            name="ssh_creds_id"
            label="SSH Credentials"
            value={platform.ssh_creds_id}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="">None</MenuItem>
            {sshCreds.map((cred) => (
              <MenuItem key={cred.id} value={cred.id}>
                {cred.ssh_username} - {cred.ssh_ip}
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
            {isEditMode && (
              <StyledButton
                onClick={() => {
                  setIsEditMode(false);
                  setPlatform({ name: '', release: '', target_id: '', winrm_creds_id: '', ssh_creds_id: '' });
                }}
                variant="outlined"
                sx={{ color: '#e74c3c', borderColor: '#e74c3c' }}
              >
                Cancel
              </StyledButton>
            )}
            <StyledButton
              onClick={savePlatform}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                backgroundColor: '#2ecc71',
                '&:hover': { backgroundColor: '#27ae60' },
              }}
            >
              {isEditMode ? 'Update' : 'Save'}
            </StyledButton>
          </Box>
        </Box>
      </StyledPaper>

      <Box sx={{ position: 'relative', marginTop: 3 }}>
        <ScrollButton
          onClick={() => handleScroll('left')}
          sx={{ left: -20, opacity: isScrolling ? 1 : 0 }}
        >
          <ChevronLeftIcon />
        </ScrollButton>
        <ScrollContainer ref={scrollContainerRef}>
          {allPlatforms.map((plat) => (
            <StyledCard key={plat.id} onClick={() => handleCardClick(plat)}>
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    marginBottom: 1,
                  }}
                >
                  <ComputerIcon sx={{ color: '#3498db', fontSize: 30, marginBottom: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#34495e',
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'left',
                    }}
                  >
                    {plat.name}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#7f8c8d',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                  }}
                >
                  Release: {plat.release}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#7f8c8d',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                  }}
                >
                  Target ID: {plat.target_id}
                </Typography>
              </CardContent>
            </StyledCard>
          ))}
        </ScrollContainer>
        <ScrollButton
          onClick={() => handleScroll('right')}
          sx={{ right: -20, opacity: isScrolling ? 1 : 0 }}
        >
          <ChevronRightIcon />
        </ScrollButton>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isModalOpen}>
          <ModalContent>
            <Typography variant="h5" component="h2" sx={{ color: '#34495e', fontWeight: 'bold', marginBottom: 2 }}>
              Platform Details
            </Typography>
            <Typography sx={{ color: '#7f8c8d', marginBottom: 1 }}>
              Name: {selectedPlatform?.name}
            </Typography>
            <Typography sx={{ color: '#7f8c8d', marginBottom: 1 }}>
              Release: {selectedPlatform?.release}
            </Typography>
            <Typography sx={{ color: '#7f8c8d', marginBottom: 2 }}>
              Target ID: {selectedPlatform?.target_id}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <StyledButton
                onClick={handleEdit}
                variant="contained"
                startIcon={<EditIcon />}
                sx={{
                  backgroundColor: '#3498db',
                  '&:hover': { backgroundColor: '#2980b9' },
                }}
              >
                Edit
              </StyledButton>
              <StyledButton
                onClick={handleDelete}
                variant="contained"
                startIcon={<DeleteIcon />}
                sx={{
                  backgroundColor: '#e74c3c',
                  '&:hover': { backgroundColor: '#c0392b' },
                }}
              >
                Delete
              </StyledButton>
            </Box>
          </ModalContent>
        </Fade>
      </Modal>
    </StyledContainer>
  );
};

export default PlatformPage;
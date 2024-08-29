import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button, CircularProgress,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ControlModal from './ControlModal';

const API_URL = 'http://localhost:8000';
// API functions
const getControls = async (profileId) => {
  return await axios.get(`${API_URL}/controls/profile/${profileId}`);
};

const getControl = async (controlId) => {
  const res=  await axios.get(`${API_URL}/controls/${controlId}`);
  console.log("response owo",res.data);
  return res;
};

const updateControl = async (controlId, updatedControl) => {
  return await axios.put(`${API_URL}/controls/${controlId}`, updatedControl);
};

const ControlsList = ({ selectedProfile }) => {
  const [controls, setControls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('control_id');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingControl, setEditingControl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchControls = async () => {
      if (!selectedProfile) return;
      setLoading(true);
      try {
        const response = await getControls(selectedProfile.id);
        setControls(response.data);
      } catch (err) {
        console.error("error fetching controls",err);
        setError('Error fetching controls');
      } finally {
        setLoading(false);
      }
    };
    fetchControls();
  }, [selectedProfile]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEditControl = async (controlId) => {
    setLoading(true);
    console.log("control id", controlId);
    try {
      const response = await getControl(controlId);
      setEditingControl({
        id: response.data.id,
        title: response.data.title,
        code: response.data.code
      });
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Error fetching control');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (editingControl) {
      console.log("editing", editingControl.code);
    }
  }, [editingControl]);

  const handleSaveControl = async (updatedControl) => {
    setLoading(true);
    try {
      await updateControl(editingControl.id, updatedControl);
      setControls((prevControls) =>
        prevControls.map((control) =>
          control.id === editingControl.id ? { ...control, ...updatedControl } : control
        )
      );
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError('Error saving control');
    } finally {
      setLoading(false);
    }
  };

  const filteredControls = controls.filter(control =>
    control.id===(searchQuery) ||
    control.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedControls = filteredControls.sort((a, b) => {
    if (orderBy === 'id') {
      return order === 'asc'
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    }
    return 0;
  });

  if (!selectedProfile) return <Typography>Please select a profile</Typography>;
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6">Controls for {selectedProfile.name}</Typography>
      <TextField
        placeholder="Search controls..."
        variant="outlined"
        size="small"
        sx={{ marginBottom: 2, width: '100%' }}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
        }}
      />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'control_id'}
                  direction={orderBy === 'control_id' ? order : 'asc'}
                  onClick={() => handleRequestSort('control_id')}
                >
                  Control ID
                </TableSortLabel>
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedControls.map(control => (
              <TableRow key={control.id}>
                <TableCell>{control.id}</TableCell>
                <TableCell>{control.title}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditControl(control.id)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        {editingControl && (
          <ControlModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            controlCode={editingControl.code}
            onSave={handleSaveControl}
          />
        )}
    </Paper>
  );
};

export default ControlsList;
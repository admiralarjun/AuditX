import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Paper, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import ControlModal from './ControlModal';

// API functions
const getControls = async (profileId) => {
  return await axios.get(`/api/controls?profile_id=${profileId}`);
};

const getControl = async (controlId) => {
  return await axios.get(`/api/controls/${controlId}`);
};

const updateControl = async (controlId, updatedControl) => {
  return await axios.put(`/api/controls/${controlId}`, updatedControl);
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
        console.error(err);
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
    try {
      const response = await getControl(controlId);
      setEditingControl(response.data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Error fetching control');
    } finally {
      setLoading(false);
    }
  };

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
    control.control_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    control.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedControls = filteredControls.sort((a, b) => {
    if (orderBy === 'control_id') {
      return order === 'asc'
        ? a.control_id.localeCompare(b.control_id)
        : b.control_id.localeCompare(a.control_id);
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
                <TableCell>{control.control_id}</TableCell>
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
          control={editingControl}
          onSave={handleSaveControl}
        />
      )}
    </Paper>
  );
};

export default ControlsList;
import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { getControls, getControlFile, updateControlFile } from '../api/api';
import ControlModal from './ControlModal'; // Update import to reflect new file structure

import { Buffer } from 'buffer'; // Ensure Buffer is available

const encodeBase64 = (text) => Buffer.from(text).toString('base64');
const decodeBase64 = (text) => Buffer.from(text, 'base64').toString('utf-8');

const ControlsList = ({ profile }) => {
  const [controls, setControls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('control');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingControl, setEditingControl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const response = await getControls(profile);
        console.log(response.data.controls);
        const fetchedControls = response.data.controls || [];
        setControls(fetchedControls);
      } catch (err) {
        console.error(err);
        setError('Error fetching controls');
      }
    };
    fetchControls();
  }, [profile]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEditControl = async (control) => {
    setLoading(true);
    try {
      const response = await getControlFile(profile, control);
      setEditingControl({
        name: control,
        code: response.data.code,
      });
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Error fetching control file');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveControl = async (updatedCode) => {
    if (typeof updatedCode !== 'string' || updatedCode.trim() === '') {
      alert('Invalid code. Please provide a valid control code.');
      return;
    }

    setLoading(true);
    try {
      await updateControlFile(profile, editingControl.name, encodeBase64(updatedCode));
      setControls((prevControls) =>
        prevControls.map((control) =>
          control === editingControl.name ? control : control
        )
      );
    } catch (err) {
      console.error(err);
      setError('Error saving control file');
    } finally {
      setLoading(false);
    }
  };

  const filteredControls = (controls || []).filter(control =>
    control.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedControls = filteredControls.sort((a, b) => {
    if (orderBy === 'control') {
      return order === 'asc'
        ? a.localeCompare(b)
        : b.localeCompare(a);
    }
    return 0;
  });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6">Manage Controls for {profile}</Typography>
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
                  active={orderBy === 'control'}
                  direction={orderBy === 'control' ? order : 'asc'}
                  onClick={() => handleRequestSort('control')}
                >
                  Control
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(sortedControls || []).map(control => (
              <TableRow key={control}>
                <TableCell>{control}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditControl(control)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ControlModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        controlCode={editingControl?.code || ''}
        onSave={handleSaveControl}
      />
    </Paper>
  );
};

export default ControlsList;

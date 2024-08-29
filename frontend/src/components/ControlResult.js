import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { executeControls, executeControlsSSH, getControls, getResult, listFiles } from '../api/api';
import JsonDisplay from '../helper/JsonDisplay';

const FileAccordion = ({ file, resultsFolder }) => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await getResult(resultsFolder, file);
        setFileData(response.data);
      } catch (err) {
        console.error(err);
        setFileData({ error: 'Error fetching file details' });
      }
    };
    fetchFileData();
  }, [file, resultsFolder]);

  if (!fileData) return <CircularProgress />;

  const isPassed = !JSON.stringify(fileData).includes('failed');

  return (
    <Accordion key={file} sx={{ marginBottom: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${file}-content`}
        id={`panel-${file}-header`}
        sx={{ backgroundColor: isPassed ? 'success.main' : 'error.main' }}
      >
        <Typography variant="body1" sx={{ color: 'white' }}>{file}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <JsonDisplay data={fileData}/>
        {/* <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(fileData, null, 2)}</pre> */}
      </AccordionDetails>
    </Accordion>
  );
};

const ControlResult = ({ profile }) => {
  const [controls, setControls] = useState([]);
  const [selectedControls, setSelectedControls] = useState({});
  const [resultsFolder, setResultsFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('control');

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const response = await getControls(profile);
        setControls(response.data.controls || []);
        // Initialize selected controls state
        const initialSelectedState = (response.data.controls || []).reduce((acc, control) => {
          acc[control] = false;
          return acc;
        }, {});
        setSelectedControls(initialSelectedState);
      } catch (err) {
        console.error(err);
        setError('Error fetching controls');
      }
    };
    fetchControls();
  }, [profile]);

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    const newSelectedControls = Object.keys(selectedControls).reduce((acc, control) => {
      acc[control] = checked;
      return acc;
    }, {});
    setSelectedControls(newSelectedControls);
  };

  const handleControlChange = (control) => {
    setSelectedControls((prev) => ({
      ...prev,
      [control]: !prev[control],
    }));
  };

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setFiles([]);

    const selectedControlsList = Object.keys(selectedControls).filter(control => selectedControls[control]);

    if (selectedControlsList.length === 0) {
      alert("Select atleast 1 control")
      setLoading(false);
      return;
    }

    try {
      const unParsedDetails = localStorage.getItem('sshCredentials');
      const sshDetails = JSON.parse(unParsedDetails);
      const pemFileName = localStorage.getItem('pemFileName');
      let response;

      if(localStorage.getItem('sshCredentials') === null){
        response = await executeControls(profile, selectedControlsList);
      } else {
        response = await executeControlsSSH(profile, selectedControlsList, sshDetails, pemFileName);
      }
      
      const folderName = response.data.results_folder;
      setResultsFolder(folderName);

      // Fetch list of files in the results folder
      const fileListResponse = await listFiles(folderName);
      setFiles(fileListResponse.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error executing controls');
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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
      {!resultsFolder ? (
        <>
          <Typography variant="h6">Select Controls for {profile}</Typography>
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
                    <Checkbox
                      checked={Object.values(selectedControls).every(Boolean)}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'control'}
                      direction={orderBy === 'control' ? order : 'asc'}
                      onClick={() => handleRequestSort('control')}
                    >
                      Control
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedControls.map(control => (
                  <TableRow key={control}>
                    <TableCell>
                      <Checkbox
                        checked={selectedControls[control]}
                        onChange={() => handleControlChange(control)}
                      />
                    </TableCell>
                    <TableCell>{control}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" color="primary" onClick={handleExecute} sx={{ marginTop: 2 }}>
            Execute Selected Controls
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6">Results for {profile}</Typography>
          {files.length > 0 ? files.map(file => (
            <FileAccordion key={file} file={file} resultsFolder={resultsFolder} />
          )) : <Typography>No results found</Typography>}
        </>
      )}
    </Paper>
  );
};

export default ControlResult;

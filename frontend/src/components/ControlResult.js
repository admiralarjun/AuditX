import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import JsonDisplay from "../helper/JsonDisplay";
// import { RepeatRounded } from "@mui/icons-material";

const API_URL = "http://localhost:8000";

const getControls = async (profileId) => {
  const res = await axios.get(`${API_URL}/controls/profile/${profileId}`);
  return res.data;
};

const executeControls = async (profileId, selectedControlsList) => {
  const selectedCredentialId = localStorage.getItem("selectedCredential");
  const selectedCredentialType = localStorage.getItem("selectedCredentialType");

  const response = await axios.post(`${API_URL}/execute_controls/${profileId}`, {
    selected_controls: selectedControlsList,
    selectedCredentialId,
    selectedCredentialType,
  });
  
  // try {
  //   await axios.post(`${API_URL}/results/`, {
  //     profile_id: profileId,
  //     result_json: JSON.stringify(response.data),
  //   });
  // } catch(err) {
  //   console.log("Error pushing result to API:", err);
  // }
  
  const parsedResults = response.data.results.map(result => JSON.parse(result));

  // Push results to API
  // for (const file of parsedResults) {
  //   try {
  //     console.log("file", file);
  //     await axios.post(`${API_URL}/results/`, {
  //       profile_id: profileId,
  //       result_json: JSON.stringify(file.result_json),
  //     });
  //     console.log(`Successfully pushed result for control ${file.id}`);
  //   } catch (err) {
  //     console.error(`Error pushing result for control ${file.id}:`, err);
  //   }
  // }

  return parsedResults;
};

const FileAccordion = ({ fileJson, fileName }) => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    if (fileJson) {
      setFileData(fileJson);
      console.log("File data set to state:", fileJson);
    } else {
      setFileData({ error: "No data available for this file" });
    }
  }, [fileJson]);

  if (!fileData) return <CircularProgress />;

  const isPassed = !JSON.stringify(fileData).includes("failed");

  return (
    <Accordion sx={{ marginBottom: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${fileName}-content`}
        id={`panel-${fileName}-header`}
        sx={{ backgroundColor: isPassed ? "success.main" : "error.main" }}
      >
        <Typography variant="body1" sx={{ color: "white" }}>
          {fileName}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <JsonDisplay data={fileData} />
      </AccordionDetails>
    </Accordion>
  );
};

const ResultDisplay = ({ files, profileName }) => {
  console.log("files, lets see", files);
  return (
    <>
      <Typography variant="h6">
        Results for {profileName}
      </Typography>
      {files.length > 0 ? (
        files.map((file, index) => (
          <FileAccordion key={index} fileName={`Control ${file.profiles[0].controls[0].id}`} fileJson={file} />
        ))
      ) : (
        <Typography>No results found</Typography>
      )}
    </>
  );
};

const ControlSelector = ({ controls, selectedControls, setSelectedControls, onExecute }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    const newSelectedControls = controls.reduce((acc, control) => {
      acc[control.id] = checked;
      return acc;
    }, {});
    setSelectedControls(newSelectedControls);
  };

  const handleControlChange = (controlId) => {
    setSelectedControls((prev) => ({
      ...prev,
      [controlId]: !prev[controlId],
    }));
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredControls = controls.filter((control) =>
    control.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedControls = filteredControls.sort((a, b) => {
    if (orderBy === "title") {
      return order === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });

  const handleExecute = () => {
    const selectedControlsList = controls
      .filter((control) => selectedControls[control.id])
      .map((control) => control.id);

    if (selectedControlsList.length === 0) {
      alert("Select at least 1 control");
      return;
    }

    onExecute(selectedControlsList);
  };

  return (
    <>
      <TextField
        placeholder="Search controls..."
        variant="outlined"
        size="small"
        sx={{ marginBottom: 2, width: "100%" }}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: "action.active", mr: 1 }} />
          ),
        }}
      />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={
                    controls.length > 0 &&
                    Object.values(selectedControls).every(Boolean)
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "title"}
                  direction={orderBy === "title" ? order : "asc"}
                  onClick={() => handleRequestSort("title")}
                >
                  Control
                </TableSortLabel>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Impact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedControls.map((control) => (
              <TableRow key={control.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedControls[control.id] || false}
                    onChange={() => handleControlChange(control.id)}
                  />
                </TableCell>
                <TableCell>{control.title}</TableCell>
                <TableCell>{control.description}</TableCell>
                <TableCell>{control.impact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={handleExecute}
        sx={{ marginTop: 2 }}
      >
        Execute Selected Controls
      </Button>
    </>
  );
};

const ControlResult = ({ selectedProfile }) => {
  const [controls, setControls] = useState([]);
  const [selectedControls, setSelectedControls] = useState({});
  const [fetched, setFetched] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchControls = async () => {
      if (selectedProfile && selectedProfile.id) {
        try {
          setLoading(true);
          const data = await getControls(selectedProfile.id);
          setControls(data || []);
          const initialSelectedState = (data || []).reduce((acc, control) => {
            acc[control.id] = false;
            return acc;
          }, {});
          setSelectedControls(initialSelectedState);
        } catch (err) {
          setError("Error fetching controls");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchControls();
  }, [selectedProfile]);

  const handleExecute = async (selectedControlsList) => {
    setLoading(true);
    setError(null);
    setFiles([]);

    try {
      const results = await executeControls(selectedProfile.id, selectedControlsList);
      setFiles(results);
      setFetched(true);
    } catch (err) {
      setError('Error executing controls: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };
  if (loading) return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </div>
  );
  if (error) return (
    <Typography color="error" sx={{ padding: 2 }}>
      {error}
    </Typography>
  );

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      {!fetched ? (
        <>
          <Typography variant="h6">
            Select Controls for {selectedProfile?.name}
          </Typography>
          <ControlSelector
            controls={controls}
            selectedControls={selectedControls}
            setSelectedControls={setSelectedControls}
            onExecute={handleExecute}
          />
        </>
      ) : (
        <ResultDisplay files={files} profileName={selectedProfile?.name} />
      )}
    </Paper>
  );
};

export default ControlResult;

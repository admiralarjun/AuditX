import React from 'react';
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const stripTrailingBlankLines = (code) => {
  return code.replace(/(\r?\n)+$/, '');
};

const formatJSON = (data) => {
  if (!data) return <Typography color="error">No data available</Typography>;

  return (
    <div>
      {data.platform && (
        <>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>Platform</Typography>
          <Paper sx={{ padding: 2, marginBottom: 2, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <Typography variant="body1"><strong>Name:</strong> {data.platform.name}</Typography>
            <Typography variant="body1"><strong>Release:</strong> {data.platform.release}</Typography>
          </Paper>
        </>
      )}

      {data.profiles && data.profiles.length > 0 && (
        <>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>Profiles</Typography>
          {data.profiles.map((profile, index) => (
            <div key={index} style={{ marginBottom: '2rem' }}>
              <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>SHA256:</strong> {profile.sha256}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>Title:</strong> {profile.title}</Typography>
                {profile.controls && profile.controls.length > 0 && (
                  <>
                    <Typography variant="body2" sx={{ marginBottom: 1 }}><strong>Controls:</strong></Typography>
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Control ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Runtime</TableCell>
                            <TableCell>Start Time</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {profile.controls.map((control) => (
                            <TableRow key={control.id}>
                              <TableCell>{control.id}</TableCell>
                              <TableCell>{control.title}</TableCell>
                              <TableCell>
                                <Chip
                                  label={control.results[0].status}
                                  color={control.results[0].status === 'passed' ? 'success' : 'error'}
                                  icon={control.results[0].status === 'passed' ? <CheckCircleIcon /> : <CancelIcon />}
                                />
                              </TableCell>
                              <TableCell>{control.results[0].run_time}s</TableCell>
                              <TableCell>{new Date(control.results[0].start_time).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Paper>

              <Typography variant="h6" sx={{ marginBottom: 1 }}>Control Code</Typography>
              {profile.controls.map((control) => (
                <div key={control.id}>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>{control.desc}</Typography>
                  <SyntaxHighlighter language="ruby" style={atomDark} showLineNumbers>
                    {stripTrailingBlankLines(control.code)}
                  </SyntaxHighlighter>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const JsonDisplay = ({ data }) => {
  return (
    <div>
      {formatJSON(data)}
    </div>
  );
};

export default JsonDisplay;

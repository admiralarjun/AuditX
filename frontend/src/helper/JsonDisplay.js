import React, { useState } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const stripTrailingBlankLines = (code) => {
  return code.replace(/(\r?\n)+$/, "");
};

const PlatformInfo = ({ platform }) => (
  <>
    <Typography variant="h6" sx={{ marginBottom: 1 }}>
      Platform
    </Typography>
    <Paper
      sx={{
        padding: 2,
        marginBottom: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}
    >
      <Typography variant="body1">
        <strong>Name:</strong> {platform.name}
      </Typography>
      <Typography variant="body1">
        <strong>Release:</strong> {platform.release}
      </Typography>
    </Paper>
  </>
);

const ProfilesInfo = ({ profiles }) => (
  <>
    <Typography variant="h6" sx={{ marginBottom: 1 }}>
      Profiles
    </Typography>
    {profiles.map((profile, index) => (
      <div key={index} style={{ marginBottom: "2rem" }}>
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            <strong>SHA256:</strong> {profile.sha256}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            <strong>Title:</strong> {profile.title}
          </Typography>
          {profile.controls && profile.controls.length > 0 && (
            <>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <strong>Controls:</strong>
              </Typography>
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
                            color={
                              control.results[0].status === "passed"
                                ? "success"
                                : "error"
                            }
                            icon={
                              control.results[0].status === "passed" ? (
                                <CheckCircleIcon />
                              ) : (
                                <CancelIcon />
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {control.results[0].run_time.toFixed(3)}s
                        </TableCell>
                        <TableCell>
                          {new Date(
                            control.results[0].start_time
                          ).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>

        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Control Code
        </Typography>
        {profile.controls.map((control) => (
          <div key={control.id}>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              {control.desc}
            </Typography>
            <SyntaxHighlighter language="ruby" style={atomDark} showLineNumbers>
              {stripTrailingBlankLines(control.code)}
            </SyntaxHighlighter>
          </div>
        ))}
      </div>
    ))}
  </>
);

const SaveResultButton = ({ send_results }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSaveResult = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // const response = await axios.post('/results/', {
      //   profile_id: send_results.profiles[0].id, // Assuming we're dealing with the first profile
      //   result_json: JSON.stringify(send_results)
      // });
      // console.log("Result saved successfully:", response.data);
      // You can add additional logic here, such as showing a success message
    } catch (error) {
      console.error("Error saving result:", error);
      setSaveError("Failed to save result. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveResult}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Result"}
        </Button>
      </Box>
      {saveError && (
        <Typography color="error" mt={1}>
          {saveError}
        </Typography>
      )}
    </>
  );
};

const to_results = (data) => {
  let send_results = {};

  if (data.platform) {
    send_results.platform = {
      name: data.platform.name || "",
      release: data.platform.release || "",
    };
  }

  if (data.profiles && Array.isArray(data.profiles)) {
    send_results.profiles = data.profiles.map((profile) => ({
      sha256: profile.sha256 || "",
      title: profile.title || "",
      controls:
        profile.controls && Array.isArray(profile.controls)
          ? profile.controls.map((control) => ({
              id: control.id || "",
              title: control.title || "",
              desc: control.desc || "",
              code: control.code || "",
              results:
                control.results && Array.isArray(control.results)
                  ? control.results.map((result) => ({
                      status: result.status || "",
                      run_time: result.run_time || 0,
                      start_time: result.start_time || "",
                    }))
                  : [],
            }))
          : [],
    }));
  }

  return send_results;
};

const JsonDisplay = ({ data }) => {
  const send_results = to_results(data);

  return (
    <div>
      {!send_results && (
        <Typography color="error">No data available</Typography>
      )}
      {send_results && (
        <>
          {send_results.platform && (
            <PlatformInfo platform={send_results.platform} />
          )}
          {send_results.profiles && send_results.profiles.length > 0 && (
            <ProfilesInfo profiles={send_results.profiles} />
          )}
          {/* <SaveResultButton send_results={send_results} /> */}
        </>
      )}
    </div>
  );
};

export default JsonDisplay;

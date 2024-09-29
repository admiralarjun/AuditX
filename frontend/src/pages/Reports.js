import AssignmentIcon from "@mui/icons-material/Assignment";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from "@mui/icons-material/Security";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography
} from "@mui/material";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { fetchReports } from "../api/reportapi";
import JsonDisplay from "../helper/JsonDisplay";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const FileAccordion = ({ fileJson, fileName }) => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    if (fileJson) {
      setFileData(fileJson);
      console.log("fileData", fileData);
    } else {
      setFileData({ error: "No data available for this file" });
    }
  }, [fileJson, fileData]);

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

const violetHackerTheme = createTheme({
  palette: {
    primary: {
      main: "#1A247E", // Violet
    },
    secondary: {
      main: "#00ff00", // Bright green
    },
    background: {
      default: "#ffffff", // White
      paper: "#fff", // White
    },
    text: {
      primary: "#1a1a1a", // Dark gray
      secondary: "#2a2a2a", // Light gray
    },
  },
});

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "auto",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}));

const ReportScroller = styled(Box)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  pb: 2,
  "&::-webkit-scrollbar": {
    height: "0.4em",
    display: "none",
  },
  "&:hover::-webkit-scrollbar": {
    display: "block",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255, 255, 255, 0.1)",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(26, 36, 126, 0.5)",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgb(26, 36, 126, 0.7)",
  },
}));

const SummaryCard = ({ icon, title, value }) => (
  <Card
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      p: 3,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      {icon}
      <Typography variant="h6" component="div" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" color="primary">
      {value}
    </Typography>
  </Card>
);

const ReportDisplay = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load reports");
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const handleReportClick = (report) => {
    console.log("report clicked");
    setSelectedReport(report);
  };

  const processReportData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        return data.flatMap(item => {
          const parsedItem = JSON.parse(item);
          return parsedItem.profiles || [];
        });
      } else if (data && data.profiles) {
        return data.profiles;
      } else {
        console.error('Unexpected data structure:', data);
        return [];
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return [];
    }
  };

  const getTotalControlsRun = () => {
    return reports.reduce((total, report) => {
      const profiles = processReportData(report.result_json);
      
      return total + profiles.reduce((profileTotal, profile) => {
        if (!profile.controls || !Array.isArray(profile.controls)) {
          console.error('Profile does not have controls array:', profile);
          return profileTotal;
        }
        return profileTotal + profile.controls.length;
      }, 0);
    }, 0);
  };

  const getTotalPassedFailed = () => {
    let passed = 0;
    let failed = 0;
    reports.forEach((report) => {
      const profiles = processReportData(report.result_json);
      
      profiles.forEach((profile) => {
        if (!profile.controls || !Array.isArray(profile.controls)) {
          console.error('Profile does not have controls array:', profile);
          return;
        }
        profile.controls.forEach((control) => {
          if (!control.results || !Array.isArray(control.results)) {
            console.error('Control does not have results array:', control);
            return;
          }
          control.results.forEach((result) => {
            if (result.status === "passed") {
              passed++;
            } else {
              failed++;
            }
          });
        });
      });
    });
    return { passed, failed };
  };

  const ReportCard = ({ report }) => {
    let passedControls = 0;
    let failedControls = 0;

    const profiles = processReportData(report.result_json);
    
    profiles.forEach((profile) => {
      if (!profile.controls || !Array.isArray(profile.controls)) {
        console.error('Profile does not have controls array:', profile);
        return;
      }
      profile.controls.forEach((control) => {
        if (!control.results || !Array.isArray(control.results)) {
          console.error('Control does not have results array:', control);
          return;
        }
        control.results.forEach((result) => {
          if (result.status === "passed") {
            passedControls++;
          } else {
            failedControls++;
          }
        });
      });
    });


    return (
      <Card
        sx={{
          minWidth: 250,
          m: 2,
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
          "&:hover": { transform: "scale(1.05)", boxShadow: 3 },
        }}
        onClick={() => handleReportClick(report)}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            component="div"
            noWrap
            color="primary"
            gutterBottom
          >
            Report at
            <Typography variant="body1" color="textSecondary">
              {formatDate(report.created_at)}
            </Typography>
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
          >
            <Chip
              icon={<CheckCircleIcon />}
              label={`Passed: ${passedControls}`}
              color="success"
              size="small"
              sx={{ opacity: 0.8, mr: 1 }}
            />
            <Chip
              icon={<CancelIcon />}
              label={`Failed: ${failedControls}`}
              color="error"
              size="small"
              sx={{ opacity: 0.8 }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const DetailedReport = ({ created_at, report }) => {
    return (
      <>
        <Typography variant="h6">
          Results ran at {formatDate(created_at)}
        </Typography>
        {report.length > 0 ? (
          report.map((file, index) => (
            <FileAccordion key={index} fileName={`Control ${JSON.parse(file).profiles[0].controls[0].id}`} fileJson={JSON.parse(file)} />
          ))
        ) : (
          <Typography>No results found</Typography>
        )}
      </>
    );
  };

  if(reports.length === 0) {
    return <Typography variant="body1" color="error">No reports found</Typography>;
  }

  return (
    <ThemeProvider theme={violetHackerTheme}>
      <StyledBox>
        <Box
          sx={{
            p: 3,
            backgroundColor: violetHackerTheme.palette.primary.main,
            color: violetHackerTheme.palette.common.white,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Reports Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <SummaryCard
                icon={<AssignmentIcon fontSize="large" color="primary" />}
                title="Total Reports"
                value={reports.length}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryCard
                icon={<SecurityIcon fontSize="large" color="secondary" />}
                title="Total Controls Run"
                value={getTotalControlsRun()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryCard
                icon={<CheckCircleIcon fontSize="large" color="success" />}
                title="Controls Passed"
                value={getTotalPassedFailed().passed}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryCard
                icon={<CancelIcon fontSize="large" color="error" />}
                title="Controls Failed"
                value={getTotalPassedFailed().failed}
              />
            </Grid>
          </Grid>
        </Box>
        <ReportScroller>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : (
            reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          )}
        </ReportScroller>
      </StyledBox>
      <Container maxWidth="lg">
        {selectedReport && <DetailedReport created_at={selectedReport.created_at} report={JSON.parse(selectedReport.result_json)} />}
      </Container>
    </ThemeProvider>
  );
};

export default ReportDisplay;
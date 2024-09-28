import AssignmentIcon from "@mui/icons-material/Assignment";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";
import {
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
import FileAccordion from "../components/FileAccordion";

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
  const [expandedControl, setExpandedControl] = useState(null);

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
    setSelectedReport(report);
  };

  const getTotalControlsRun = () => {
    return reports.reduce((total, report) => {
      try {
        const data = JSON.parse(report.result_json);
        return (
          total +
          data.profiles.reduce(
            (profileTotal, profile) => profileTotal + profile.controls.length,
            0
          )
        );
      } catch (error) {
        console.error(`Error parsing report ${report.id}:`, error);
        return total;
      }
    }, 0);
  };

  const getTotalPassedFailed = () => {
    let passed = 0;
    let failed = 0;
    reports.forEach((report) => {
      try {
        const data = JSON.parse(report.result_json);
        data.profiles.forEach((profile) => {
          profile.controls.forEach((control) => {
            if (control.results[0].status === "passed") {
              passed++;
            } else {
              failed++;
            }
          });
        });
      } catch (error) {
        console.error(`Error parsing report ${report.id}:`, error);
      }
    });
    return { passed, failed };
  };

  const ReportCard = ({ report }) => {
    try {
      const data = JSON.parse(report.result_json);
      const passedControls = data.profiles.reduce(
        (total, profile) =>
          total +
          profile.controls.filter(
            (control) => control.results[0].status === "passed"
          ).length,
        0
      );
      const failedControls = data.profiles.reduce(
        (total, profile) =>
          total +
          profile.controls.filter(
            (control) => control.results[0].status !== "passed"
          ).length,
        0
      );

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
              Report {report.id}
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
    } catch (error) {
      console.error(`Error parsing report ${report.id}:`, error);
      return null;
    }
  };

  const DetailedReport = ({ report }) => {
    console.log("report", report);
    console.log("report.result_json", JSON.parse(report.result_json));
    return (
      <FileAccordion fileName={`Report ${report.profile_id}`} fileJson={JSON.parse(report.result_json)} />
    );
  };

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
          {selectedReport && <DetailedReport report={selectedReport} />}
      </Container>
    </ThemeProvider>
  );
};

export default ReportDisplay;

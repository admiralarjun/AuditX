import AssignmentIcon from "@mui/icons-material/Assignment";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SecurityIcon from "@mui/icons-material/Security";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { jsPDF } from "jspdf";
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
  height: "100vh",
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
    try {
      const data = JSON.parse(report.result_json);

      const handleAccordionChange = (controlId, isExpanded) => {
        setExpandedControl(isExpanded ? controlId : null);
      };

      const exportPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text(`Detailed Report: ${report.id}`, 14, 20);

        // Add platform information
        doc.setFontSize(14);
        doc.text("Platform", 14, 30);
        doc.setFontSize(12);
        doc.text(`Name: ${data.platform.name}`, 14, 40);
        doc.text(`Release: ${data.platform.release}`, 14, 50);

        let yPos = 70;

        // Add profile and control information
        data.profiles.forEach((profile, index) => {
          doc.setFontSize(14);
          doc.text(`Profile: ${profile.title}`, 14, yPos);
          yPos += 10;
          doc.setFontSize(10);
          doc.text(`SHA256: ${profile.sha256}`, 14, yPos);
          yPos += 10;

          // Add table for controls
          const tableData = profile.controls.map((control) => [
            control.id,
            control.title,
            control.results[0].status,
          ]);

          doc.autoTable({
            startY: yPos,
            head: [["Control ID", "Title", "Status"]],
            body: tableData,
          });

          yPos = doc.lastAutoTable.finalY + 20;

          // Add new page if needed
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });

        // Save the PDF
        doc.save(`Report_${report.id}.pdf`);
      };
      return (
        <Box sx={{ mt: 4, pb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Detailed Report
            </Typography>
            <Tooltip title="Export as PDF">
              <IconButton onClick={exportPDF}>
                <PictureAsPdfIcon color="error" />
              </IconButton>
            </Tooltip>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Platform
                </Typography>
                <Typography variant="body1">
                  Name: {data.platform.name}
                </Typography>
                <Typography variant="body1">
                  Release: {data.platform.release}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Statistics
                </Typography>
                <Typography variant="body1">
                  Total Controls:{" "}
                  {data.profiles.reduce(
                    (total, profile) => total + profile.controls.length,
                    0
                  )}
                </Typography>
                <Typography variant="body1">
                  Passed Controls:{" "}
                  {data.profiles.reduce(
                    (total, profile) =>
                      total +
                      profile.controls.filter(
                        (control) => control.results[0].status === "passed"
                      ).length,
                    0
                  )}
                </Typography>
                <Typography variant="body1">
                  Failed Controls:{" "}
                  {data.profiles.reduce(
                    (total, profile) =>
                      total +
                      profile.controls.filter(
                        (control) => control.results[0].status !== "passed"
                      ).length,
                    0
                  )}
                </Typography>
              </Paper>
            </Grid>
            {data.profiles.map((profile) => (
              <Grid item xs={12} key={profile.sha256}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Profile: {profile.title}
                  </Typography>
                  {profile.controls.map((control) => (
                    <FileAccordion
                    key={control.id}
                    control={control}
                    expanded={expandedControl === control.id}
                    onChange={handleAccordionChange}
                    />
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    } catch (error) {
      console.error(`Error parsing detailed report ${report.id}:`, error);
      return <Typography variant="body1">Failed to load report details</Typography>;
    }
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
        <Container maxWidth="lg">
          {selectedReport && <DetailedReport report={selectedReport} />}
        </Container>
      </StyledBox>
    </ThemeProvider>
  );
};

export default ReportDisplay;

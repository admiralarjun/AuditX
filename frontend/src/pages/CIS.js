import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Modal,
  Fade,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";

// Custom styled components (unchanged)
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: "#f0f4f8",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: "bold",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: 100,
  borderRadius: theme.spacing(2),
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
}));

const CIS = () => {
  const [pdfInfo, setPdfInfo] = useState({
    pdf_title: "",
    tag: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("Upload PDF File");
  const [allPdfs, setAllPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllPdfs();
  }, []);

  const fetchAllPdfs = async () => {
    try {
      axios.defaults.baseURL = "http://localhost:8000";
      const response = await axios.get("/cis_pdfs/");
      setAllPdfs(response.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      if (error.response && error.response.status === 405) {
        console.error(
          "Method not allowed. GET request might not be implemented on the backend."
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPdfInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFileName(file.name);
      setPdfFile(file);
    }
  };

  const uploadPdf = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf_file", pdfFile);

    try {
      axios.defaults.baseURL = "http://localhost:8000";
      const response = await axios.post(
        `/cis_pdfs/?pdf_title=${encodeURIComponent(
          pdfInfo.pdf_title
        )}&tag=${encodeURIComponent(pdfInfo.tag)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        alert("PDF uploaded successfully.");
        fetchAllPdfs();
        setPdfInfo({ pdf_title: "", tag: "" });
        setPdfFileName("Upload PDF File");
        setPdfFile(null);
      } else {
        alert("Failed to upload PDF.");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        alert(
          `Failed to upload PDF. Server response: ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Failed to upload PDF. No response received from the server.");
      } else {
        console.error("Error setting up request:", error.message);
        alert(`Failed to upload PDF. Error: ${error.message}`);
      }
    }
  };

  const handleCardClick = (pdf) => {
    setSelectedPdf(pdf);
    setIsModalOpen(true);
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#34495e", fontWeight: "bold" }}
        >
          Upload CIS Benchmark
        </Typography>
        <Box component="form" sx={{ display: "flex", flexDirection: "column" }}>
          <StyledTextField
            name="pdf_title"
            label="PDF Title"
            variant="outlined"
            fullWidth
            value={pdfInfo.pdf_title}
            onChange={handleChange}
          />
          <StyledTextField
            name="tag"
            label="Tag"
            variant="outlined"
            fullWidth
            value={pdfInfo.tag}
            onChange={handleChange}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfFileChange}
              style={{ display: "none" }}
              id="pdf-file-upload"
            />
            <label htmlFor="pdf-file-upload">
              <StyledButton
                variant="outlined"
                component="span"
                startIcon={<AddIcon />}
                sx={{ color: "#3498db", borderColor: "#3498db" }}
              >
                {pdfFileName}
              </StyledButton>
            </label>
            <StyledButton
              onClick={uploadPdf}
              variant="contained"
              startIcon={<UploadIcon />}
              sx={{
                backgroundColor: "#2ecc71",
                "&:hover": { backgroundColor: "#27ae60" },
              }}
            >
              Upload
            </StyledButton>
          </Box>
        </Box>
      </StyledPaper>

      <Box sx={{ marginTop: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#34495e", fontWeight: "bold" }}
        >
          Uploaded Benchmarks
        </Typography>
        <Grid container spacing={2}>
          {allPdfs.map((pdf) => (
            <Grid item xs={12} sm={6} md={4} key={pdf.id}>
              <StyledCard onClick={() => handleCardClick(pdf)}>
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                    }}
                  >
                    <PictureAsPdfIcon
                      sx={{ color: "#e74c3c", fontSize: 24, marginRight: 1 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#34495e",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {pdf.pdf_title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#7f8c8d",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tag: {pdf.tag}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isModalOpen}>
          <ModalContent>
            <Typography
              variant="h5"
              component="h2"
              sx={{ color: "#34495e", fontWeight: "bold", marginBottom: 2 }}
            >
              PDF Details
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 1 }}>
              Title: {selectedPdf?.pdf_title}
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 1 }}>
              Tag: {selectedPdf?.tag}
            </Typography>
            <Typography sx={{ color: "#7f8c8d", marginBottom: 2 }}>
              Path: {selectedPdf?.pdf_path}
            </Typography>
            <StyledButton
              onClick={() => setIsModalOpen(false)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#3498db",
                "&:hover": { backgroundColor: "#2980b9" },
              }}
            >
              Close
            </StyledButton>
          </ModalContent>
        </Fade>
      </Modal>
    </StyledContainer>
  );
};

export default CIS;

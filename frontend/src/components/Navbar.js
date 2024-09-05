import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import VpnKeyIcon from "@mui/icons-material/VpnKey"; // Import the icon
import Save from "@mui/icons-material/Save";
import SecurityIcon from "@mui/icons-material/Security"; // Import CIS Benchmarks Icon
import AssessmentIcon from "@mui/icons-material/Assessment"; // Import Reports Icon
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#1a237e", padding: "0 16px" }}
    >
      <Toolbar>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#ffffff" }}
          >
            AuditX
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={Link} to="/" sx={buttonStyles}>
              Home
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/profiles"
              sx={buttonStyles}
            >
              Profiles
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/execute"
              sx={buttonStyles}
            >
              Execute
            </Button>
            <IconButton
              color="inherit"
              component={Link}
              to="/platform"
              sx={iconButtonStyles}
            >
              <AssessmentIcon /> {/* Reports Icon */}
            </IconButton>
            {/* Replace SSH Credentials Button with IconButton */}
            <IconButton
              color="inherit"
              component={Link}
              to="/ssh_page"
              sx={iconButtonStyles}
            >
              <VpnKeyIcon /> {/* SSH Key Icon */}
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to="/winrm_page"
              sx={iconButtonStyles}
            >
              <SecurityIcon /> {/* Security Icon for WinRM */}
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to="/cis_page"
              sx={iconButtonStyles}
            >
              <MenuBookIcon /> {/* SSH Key Icon */}
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to="/reports"
              sx={iconButtonStyles}
            >
              <AssessmentIcon /> {/* Reports Icon */}
            </IconButton>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

const buttonStyles = {
  fontWeight: "bold",
  textTransform: "none",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#3949ab",
  },
};

const iconButtonStyles = {
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#3949ab",
  },
};

export default Navbar;

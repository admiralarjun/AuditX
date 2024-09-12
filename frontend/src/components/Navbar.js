import React from "react";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import VpnKeyIcon from "@mui/icons-material/VpnKey"; // Import the icon
import AssessmentIcon from "@mui/icons-material/Assessment"; // Import Reports Icon
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Home } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ComputerIcon from "@mui/icons-material/Computer";

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
            <IconButton
              color="inherit"
              component={Link}
              to="/"
              sx={buttonStyles}
            >
              <Home />
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to="/credentials"
              sx={iconButtonStyles}
            >
              <VpnKeyIcon />
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to="/platform"
              sx={buttonStyles}
            >
              <ComputerIcon />
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to="/profiles-and-execute"
              sx={buttonStyles}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to="/reports"
              sx={iconButtonStyles}
            >
              <AssessmentIcon />
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to="/cis_page"
              sx={iconButtonStyles}
            >
              <MenuBookIcon />
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

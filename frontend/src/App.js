import { CssBaseline } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CIS from "./pages/CIS";
import Home from "./pages/Home";
import PlatformPage from "./pages/Platform";
import ProfilesAndExecute from "./pages/Audit";
import ReportDisplay from "./pages/Reports";
import CredentialsPage from "./pages/Credentials";

const App = () => (
  <Router>
    <CssBaseline />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profiles-and-execute" element={<ProfilesAndExecute />} />
      <Route path="/credentials" element={<CredentialsPage />} />
      <Route path="/cis_page" element={<CIS />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/reports" element={<ReportDisplay />} />
    </Routes>
  </Router>
);

export default App;

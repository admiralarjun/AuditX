import { CssBaseline } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CIS from "./pages/CIS";
import Execute from "./pages/Execute";
import Home from "./pages/Home";
import PlatformPage from "./pages/Platform";
import Profiles from "./pages/Profiles";
import SSHPage from "./pages/SSHPage";
import WinRMPage from "./pages/WinRMPage";
import ReportDisplay from "./pages/Reports";

const App = () => (
  <Router>
    <CssBaseline />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profiles" element={<Profiles />} />
      <Route path="/execute" element={<Execute />} />
      <Route path="/ssh_page" element={<SSHPage />} />
      <Route path="/winrm_page" element={<WinRMPage />} />
      <Route path="/cis_page" element={<CIS />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/reports" element={<ReportDisplay />} />
    </Routes>
  </Router>
);

export default App;

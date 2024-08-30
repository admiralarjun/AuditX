import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profiles from "./pages/Profiles";
import Execute from "./pages/Execute";
import SSHPage from "./pages/SSHPage";
import WinRMPage from "./pages/WinRMPage";
import CIS from "./pages/CIS";
import { CssBaseline } from "@mui/material";

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
    </Routes>
  </Router>
);

export default App;

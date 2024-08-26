import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profiles from './pages/Profiles';
import Execute from './pages/Execute';
import { CssBaseline } from '@mui/material';

const App = () => (
  <Router>
    <CssBaseline />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profiles" element={<Profiles />} />
      <Route path="/execute" element={<Execute />} />
    </Routes>
  </Router>
);

export default App;

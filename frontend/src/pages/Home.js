import React from 'react';
import {
  Typography, Container, Grid, Card, CardContent, Box, Avatar, IconButton, Tooltip, Button, Badge
} from '@mui/material';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, Tooltip as RechartTooltip
} from 'recharts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import { DataGrid } from '@mui/x-data-grid';
import HorizontalTimeline from '../components/HorizontalTimeline';
const dataRadar = [
  { subject: 'User Accounts', A: 120, fullMark: 150 },
  { subject: 'System Services', A: 98, fullMark: 150 },
  { subject: 'Network Config', A: 86, fullMark: 150 },
  { subject: 'File Integrity', A: 99, fullMark: 150 },
  { subject: 'Audit Logging', A: 85, fullMark: 150 },
  { subject: 'Patch Management', A: 65, fullMark: 150 },
];

const dataBar = [
  { name: 'Windows 11 (Enterprise)', audited: 80 },
  { name: 'Windows 11 (Standalone)', audited: 60 },
  { name: 'Red Hat Enterprise 8', audited: 90 },
  { name: 'Red Hat Enterprise 9', audited: 70 },
  { name: 'Ubuntu 20.04 LTS', audited: 50 },
  { name: 'Ubuntu 22.04 LTS', audited: 30 },
];

const dataPie = [
  { name: 'Compliant', value: 400 },
  { name: 'Non-Compliant', value: 300 },
  { name: 'Partial Compliance', value: 300 },
];

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

const dataLine = [
  { name: 'January', compliance: 400 },
  { name: 'February', compliance: 300 },
  { name: 'March', compliance: 500 },
  { name: 'April', compliance: 450 },
  { name: 'May', compliance: 480 },
  { name: 'June', compliance: 530 },
];

const rows = [
  { id: 1, os: 'Windows 11 (Enterprise)', date: '2024-08-28', status: 'Compliant', deviations: 5 },
  { id: 2, os: 'Ubuntu 22.04 LTS', date: '2024-08-27', status: 'Non-Compliant', deviations: 10 },
  { id: 3, os: 'Red Hat Enterprise 8', date: '2024-08-25', status: 'Compliant', deviations: 3 },
  { id: 4, os: 'Windows 11 (Standalone)', date: '2024-08-24', status: 'Partial Compliance', deviations: 7 },
  { id: 5, os: 'Ubuntu 20.04 LTS', date: '2024-08-23', status: 'Non-Compliant', deviations: 15 },
];

const columns = [
  { field: 'os', headerName: 'Operating System', width: 250 },
  { field: 'date', headerName: 'Audit Date', width: 150 },
  { field: 'status', headerName: 'Compliance Status', width: 200 },
  { field: 'deviations', headerName: 'Deviations', width: 150 },
];

const Home = () => (
  <Container maxWidth="lg" sx={{ padding: 4 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      <Box>
        <Typography variant="h4">Welcome to AuditX</Typography>
        <Typography variant="body1" color="textSecondary">Compliance and audit management platform to manage and execute control scripts</Typography>
        <HorizontalTimeline />
      </Box>
    </Box>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Compliance Overview</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="Compliance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Tooltip title="More details">
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Audit Progress</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataBar}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartTooltip />
                <Bar dataKey="audited" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Tooltip title="Audit History">
                <Button variant="contained" size="small">View History</Button>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Compliance Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dataPie} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Tooltip title="View Reports">
                <Button variant="contained" size="small">Generate Report</Button>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AssignmentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Audits</Typography>
            </Box>
            <Box style={{ height: 250 }}>
              <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AssessmentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Compliance Trends</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dataLine}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <RechartTooltip />
                <Legend />
                <Line type="monotone" dataKey="compliance" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <InfoIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Key Insights & Recommendations</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              - High compliance rate in user accounts management.<br />
              - Need for improvement in patch management.<br />
              - Focus required on file integrity monitoring.<br />
              - Network configuration is mostly compliant, but some areas need review.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  </Container>
);

export default Home;

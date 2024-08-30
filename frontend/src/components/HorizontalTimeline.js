import React from 'react';
import { Box, Typography, Tooltip, Stack } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventIcon from '@mui/icons-material/Event';
import { styled } from '@mui/material/styles';

const GradientConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(95deg, #f39c12 0%, #e74c3c 50%, #e74c3c 100%)', // Active
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(95deg, #2ecc71 0%, #27ae60 50%, #16a085 100%)', // Compliant
    },
  },
  [`&.${stepConnectorClasses.disabled}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(95deg, #bdc3c7 0%, #95a5a6 50%, #95a5a6 100%)', // Upcoming
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const GradientStepIcon = styled('div')(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.status === 'active',
      style: {
        backgroundImage: 'linear-gradient(136deg, #f39c12 0%, #e74c3c 50%, #e74c3c 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.status === 'completed',
      style: {
        backgroundImage: 'linear-gradient(136deg, #2ecc71 0%, #27ae60 50%, #16a085 100%)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.status === 'partial',
      style: {
        backgroundImage: 'linear-gradient(136deg, #f39c12 0%, #f1c40f 50%, #f1c40f 100%)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.status === 'upcoming',
      style: {
        backgroundImage: 'linear-gradient(136deg, #3498db 0%, #2980b9 50%, #1abc9c 100%)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.status === 'disabled',
      style: {
        backgroundImage: 'linear-gradient(136deg, #bdc3c7 0%, #95a5a6 50%, #95a5a6 100%)',
      },
    },
  ],
}));

function GradientStepIconComponent(props) {
  const { status, className } = props;

  const icons = {
    compliant: <CheckCircleIcon />,
    nonCompliant: <CancelIcon />,
    partial: <WarningIcon />,
    upcoming: <ScheduleIcon />,
    active: <EventIcon />,
  };

  return (
    <GradientStepIcon ownerState={{ status }} className={className}>
      {icons[status]}
    </GradientStepIcon>
  );
}

export default function CustomizedTimeline() {
  const now = new Date();
  
  const steps = [
    { date: '2024-08-28', title: 'Windows 11 (Enterprise) Audit', status: 'completed' },
    { date: '2024-08-27', title: 'Ubuntu 22.04 LTS Audit', status: 'nonCompliant' },
    { date: '2024-08-25', title: 'Red Hat Enterprise 8 Audit', status: 'completed' },
    { date: '2024-08-24', title: 'Windows 11 (Standalone) Audit', status: 'partial' },
    { date: '2024-08-20', title: 'Scheduled: Ubuntu 18.04 LTS Audit', status: 'upcoming' },
    { date: '2024-08-30', title: 'Scheduled: Windows Server 2019 Audit', status: 'upcoming' },
    { date: '2024-09-01', title: 'Scheduled: Ubuntu 20.04 LTS Audit', status: 'upcoming' },
    { date: '2024-09-05', title: 'Scheduled: CentOS 8 Audit', status: 'upcoming' },
    { date: '2024-09-10', title: 'Scheduled: Red Hat Enterprise 9 Audit', status: 'upcoming' },
  ];

  const getStepStatus = (date) => {
    const stepDate = new Date(date);
    if (stepDate < now) return 'completed';
    if (stepDate.toDateString() === now.toDateString()) return 'active';
    return 'upcoming';
  };

  return (
    <Stack sx={{ width: '100%', padding: 2 }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={steps.findIndex(step => getStepStatus(step.date) === 'active')}
        connector={<GradientConnector />}
      >
        {steps.map((step, index) => (
          <Step key={step.date}>
            <StepLabel StepIconComponent={(props) => (
              <GradientStepIconComponent status={getStepStatus(step.date)} {...props} />
            )}>
              <Tooltip title={step.title}>
                <Box>
                  <Typography variant="body2">{step.title}</Typography>
                </Box>
              </Tooltip>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}

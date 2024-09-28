import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import React from 'react';
import { JsonDisplay2 } from "../helper/JsonDisplay";

const FileAccordion = ({ control, expanded, onChange }) => {
  const isPassed = control.results[0].status === "passed";
  console.log("Control:", control);
  console.log("Expanded:", expanded);
  return (
    <Accordion 
      expanded={expanded}
      onChange={(event, isExpanded) => onChange(control.id, isExpanded)}
      sx={{ marginBottom: 2 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${control.id}-content`}
        id={`panel-${control.id}-header`}
        sx={{ backgroundColor: isPassed ? "success.main" : "error.main" }}
      >
        <Typography variant="body1" sx={{ color: "white" }}>
          {control.id}: {control.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <JsonDisplay2 data={control} />
      </AccordionDetails>
    </Accordion>
  );
};

export default FileAccordion;
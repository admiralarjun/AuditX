import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import JsonDisplay from '../helper/JsonDisplay';

const FileAccordion = ({ fileJson, fileName }) => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    if (fileJson) {
      setFileData(fileJson);
    } else {
      setFileData({ error: "No data available for this file" });
    }
  }, [fileJson]);

  if (!fileData) return <CircularProgress />;

  const isPassed = !JSON.stringify(fileData).includes("failed");

  return (
    <>
      <JsonDisplay data={fileData} />
    </>
    // <Accordion sx={{ marginBottom: 2 }}>
    //   <AccordionSummary
    //     expandIcon={<ExpandMoreIcon />}
    //     aria-controls={`panel-${fileName}-content`}
    //     id={`panel-${fileName}-header`}
    //     sx={{ backgroundColor: isPassed ? "success.main" : "error.main" }}
    //   >
    //     <Typography variant="body1" sx={{ color: "white" }}>
    //       {fileName}
    //     </Typography>
    //   </AccordionSummary>
    //   <AccordionDetails>
    //     <JsonDisplay  data={fileData} />
    //   </AccordionDetails>
    // </Accordion>
  );
};

export default FileAccordion;
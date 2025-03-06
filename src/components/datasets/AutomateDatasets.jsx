import { Tabs,Tab ,Box} from "@mui/material";
import {  ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from "@/themes/theme";
import DatasetStyle from "@/styles/dataset";

import InterAutomateDataset from "./InterAutomateDataset";
import IntraAutomateDataset from "./IntraAutomateDataset";

const AutomateDatasets = () => {
        /* eslint-disable react-hooks/exhaustive-deps */

  const classes = DatasetStyle();

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };



  return (
    <ThemeProvider theme={themeDefault}>
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} >
        <Tab label="Inter-Automate Datasets" sx={{ fontSize: 16, fontWeight: '700' }}/>
        <Tab label="Intra-Automate Datasets" sx={{ fontSize: 16, fontWeight: '700' }} />
      </Tabs>
      {selectedTab === 0 && <InterAutomateDataset/>}
      {selectedTab === 1 && <IntraAutomateDataset />}
    </Box>
    </ThemeProvider>


  );
};

export default AutomateDatasets;
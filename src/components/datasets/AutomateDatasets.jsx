import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {  ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from "@/themes/theme";
import DatasetStyle from "@/styles/dataset";

import InterAutomateDataset from "./InterAutomateDataset";
import IntraAutomateDataset from "./IntraAutomateDataset";
import { useTheme } from "@/context/ThemeContext";

const AutomateDatasets = () => {
        /* eslint-disable react-hooks/exhaustive-deps */

  const classes = DatasetStyle();
  const { dark } = useTheme();

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };



  return (
    <ThemeProvider theme={themeDefault}>
      <Box sx={{ width: '100%', typography: 'body1', backgroundColor: dark ? "#1e1e1e" : "", minHeight: "100vh" }}>
      <Tabs
  value={selectedTab}
  onChange={handleTabChange}
  sx={{
    backgroundColor: dark ? "#252525" : "",
    borderBottom: dark ? "1px solid #3a3a3a" : "",
    "& .MuiTab-root": { color: dark ? "#a0a0a0" : "" },
    "& .MuiTab-root.Mui-selected": { color: dark ? "#ffffff" : "" },
    "& .MuiTabs-indicator": { backgroundColor: dark ? "#fb923c" : "" },
  }}
>
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
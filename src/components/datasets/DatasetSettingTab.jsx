import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import React from 'react'
import { useState } from 'react'
import { useTheme } from "@/context/ThemeContext";
import BasicDatasetSettings from './BasicDatasetSettings';
import DatasetSettings from './DatasetSettings';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={4}>
                    <Typography component="div" sx={{ color: dark ? "#ececec" : "" }}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const DatasetSettingTabs = () => {
        /* eslint-disable react-hooks/exhaustive-deps */

    const [tabValue, setTabValue] = useState(0);
    const { dark } = useTheme();
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    return (
        <Card
  sx={{
    width: "100%",
    minHeight: 500,
    padding: 5,
    '@media (max-width: 600px)': {
      padding: 2, 
    },
    backgroundColor: dark ? "#2a2a2a" : "",
    color: dark ? "#ececec" : "",
    border: dark ? "1px solid #3a3a3a" : "",
    boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.4)" : "",
  }}
>
      
        <Box >
              <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{
                            mb:3,
                             textAlign: {
                                xs: "center", 
                                sm: "left", 
                },
                        }}
                    >
                        <Typography variant="h3" gutterBottom component="div" sx={{ fontWeight: 900, color: dark ? "#ececec" : "" }}>
                        DataSet Settings
                        </Typography>
                    </Grid>
            <Box sx={{
                mb:2
                }} >
                <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="user-tabs"
                sx={{
                    '& .MuiTabs-flexContainer': {
                    justifyContent: {
                        xs: 'center',
                        sm: 'flex-start'
                    }
                    },
                    "& .MuiTab-root": { color: dark ? "#a0a0a0" : "" },
                    "& .MuiTab-root.Mui-selected": { color: dark ? "#ffffff" : "" },
                    "& .MuiTabs-indicator": { backgroundColor: dark ? "#fb923c" : "" },
  }}
>
  <Tab label="Basic " sx={{ fontSize: 17, fontWeight: '700', marginRight: {xs:4, sm:6}}} />
  <Tab label=" Advanced " sx={{ fontSize: 17, fontWeight: '700' }} />
</Tabs>
                    
            </Box>
            <Divider sx={{ borderColor: dark ? "#3a3a3a" : "" }}/>
            <Box>
                <TabPanel value={tabValue} index={0} dark={dark}>
                    <BasicDatasetSettings />  
                </TabPanel>
                <TabPanel value={tabValue} index={1} dark={dark}>
                    <DatasetSettings />
                </TabPanel>
            </Box>
        </Box>
        </Card>
    )
}

export default DatasetSettingTabs
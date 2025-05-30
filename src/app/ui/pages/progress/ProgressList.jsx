import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import React from 'react'
import { useState } from 'react'
import ProgressAnalytics from './ProgressAnalytics';
import TaskAnalytics from "./TaskAnalytics/TaskAnalytics";
import MetaAnalytics from "./MetaAnalytics/MetaAnalytics";
import {useSelector} from "react-redux";
import PerformanceAnalytics from './PerformanaceAnalytics/PerformanceAnalytics';


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
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const ProgressList = () => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    const loggedInUserData = useSelector(
        (state) => state.getLoggedInData.data
      );
    
    return (
      
        <>
            <Box sx={{m:1}} >
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs" variant='scrollable'                     
                >
                    <Tab label="Task Analytics " sx={{ fontSize: 16, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="Meta Analytics " sx={{ fontSize: 16, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="Advance Analytics " sx={{ fontSize: 16, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="Performance Analytics " sx={{ fontSize: 16, fontWeight: '700', marginRight: '28px !important' }} /> 
                </Tabs>
            </Box>
            <Box sx={{ p: 1}}>
                <TabPanel value={tabValue} index={0}>
                <TaskAnalytics loggedInUserData ={loggedInUserData} />  
                </TabPanel> 
                <TabPanel value={tabValue} index={1}>
                <MetaAnalytics loggedInUserData ={loggedInUserData} />  
                </TabPanel>  
                <TabPanel value={tabValue} index={2}>
                <ProgressAnalytics />  
                </TabPanel> 
                <TabPanel value={tabValue} index={3}>
                <PerformanceAnalytics />  
                </TabPanel>   
            </Box>
        </>
       
    )
}

export default ProgressList;

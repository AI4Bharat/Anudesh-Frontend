"use client"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import React from 'react'
import { useState } from 'react'
import AnnotationDetails from './AnnotationDetails';
import TaskDetails from './TaskDetails';
import UserDetail from './UserDetails';
import QueuedTasksDetails from './QueuedTasksDetails';
import { useTheme } from "@/context/ThemeContext";

function TabPanel(props) {
    const { children, value, index, dark, ...other } = props;

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
                    <Typography component="div" sx={{ color: dark ? "#ececec" : "" }}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const Admin = () => {
    const { dark } = useTheme();
    const [tabValue, setTabValue] = useState(0);
 /* eslint-disable react-hooks/exhaustive-deps */

    const handleTabChange = (e, v) => {
        setTabValue(v)
    }

    return (
      <Box sx={{ backgroundColor: dark ? "#1e1e1e" : "", minHeight: "100vh", p: dark ? 1 : 0 }}>
            <Box sx={{ mb: 2, backgroundColor: dark ? "#252525" : "", borderRadius: dark ? "8px" : "", border: dark ? "1px solid #3a3a3a" : "" }}>
                <Tabs
    value={tabValue}
    onChange={handleTabChange}
    aria-label="admin-tabs"
    variant="scrollable"
    sx={{ 
        '& .MuiTab-root': { 
            fontSize: 17, 
            fontWeight: '700', 
            marginRight: '32px',
            color: dark ? "#a0a0a0" : "",
        },
        '& .MuiTab-root.Mui-selected': {
            color: dark ? "#ffffff" : "",
        },
        '& .MuiTabs-indicator': {
            backgroundColor: dark ? "#fb923c" : "",
        },
        padding: "20px",
        borderBottom: dark ? "1px solid #3a3a3a" : "",
    }}
>
                    <Tab label="Task Details" />
                    <Tab label="Annotation Details" />
                    <Tab label="User Details" />
                    <Tab label="Queued Tasks Status" />
                </Tabs>
            </Box>
            <Box sx={{ p: 1}}>
                <TabPanel value={tabValue} index={0} dark={dark}>
                    <Paper variant="outlined" sx={{ borderRadius: "8px", backgroundColor: dark ? "#2a2a2a" : 'ButtonHighlight', padding: '16px', border: dark ? "1px solid #3a3a3a" : "", boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.4)" : "" }}>
                    <TaskDetails  />  
               </Paper>
                </TabPanel> 
                <TabPanel value={tabValue} index={1} dark={dark}>
                    <Paper variant="outlined" sx={{ borderRadius: "8px", backgroundColor: dark ? "#2a2a2a" : 'ButtonHighlight', padding: '16px', border: dark ? "1px solid #3a3a3a" : "", boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.4)" : "" }}>
                    <AnnotationDetails  />  
                </Paper>
                </TabPanel> 
                <TabPanel value={tabValue} index={2} dark={dark}>
                    <Paper variant="outlined" sx={{ borderRadius: "8px", backgroundColor: dark ? "#2a2a2a" : 'ButtonHighlight', border: dark ? "1px solid #3a3a3a" : "", boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.4)" : "" }}>
                        <UserDetail  />
                    </Paper>
                </TabPanel> 
                <TabPanel value={tabValue} index={3} dark={dark}>
                    <Paper variant="outlined" sx={{ borderRadius: "8px", backgroundColor: dark ? "#2a2a2a" : 'ButtonHighlight', border: dark ? "1px solid #3a3a3a" : "", boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.4)" : "" }}>
                        <QueuedTasksDetails  /> 
                    </Paper>
                </TabPanel> 
            </Box>
        </Box>
       
    )
}

export default Admin

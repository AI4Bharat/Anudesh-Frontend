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
                <Box 
                    sx={{ 
                        p: { xs: 2, sm: 3, md: 4 }, 
                        backgroundColor: '#ffffff', 
                        borderRadius: '24px', 
                        boxShadow: '0px 12px 48px rgba(0, 0, 0, 0.04)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        animation: 'tabEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        transformOrigin: 'top center',
                    }}
                >
                    <style>
                        {`
                        @keyframes tabEnter {
                            0% { opacity: 0; transform: translateY(12px) scale(0.99); }
                            100% { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        `}
                    </style>
                    <Typography component="div">{children}</Typography>
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
    
    // Shared tab styling
    const tabStyles = {
        zIndex: 2,
        fontSize: { xs: 14, sm: 15 },
        fontWeight: '600',
        textTransform: 'none',
        minHeight: '44px',
        borderRadius: '12px',
        color: '#64748b',
        transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        px: { xs: 2, sm: 3 },
        marginRight: '0px !important',
        '&.Mui-selected': {
            color: '#0f172a',
        },
        '&:hover:not(.Mui-selected)': {
            color: '#334155',
        }
    };

    return (
      
        <Box sx={{ maxWidth: '1600px', margin: '0 auto', p: { xs: 1, sm: 2, md: 3 } }}>
            <Box sx={{ 
                mb: 4, 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                overflowX: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                position: 'relative',
                zIndex: 0,
            }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    aria-label="user-tabs" 
                    variant='scrollable'                     
                    scrollButtons="auto"
                    sx={{
                        background: '#f8fafc',
                        borderRadius: '16px',
                        padding: '6px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                        minHeight: '56px',
                        '& .MuiTabs-indicator': {
                            height: '100%',
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.01)',
                            zIndex: 1,
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        },
                        '& .MuiTabs-flexContainer': {
                            gap: { xs: '4px', sm: '8px' },
                            position: 'relative',
                        }
                    }}
                >
                    <Tab label="Task Analytics" disableRipple sx={tabStyles} />
                    <Tab label="Meta Analytics" disableRipple sx={tabStyles} />
                    <Tab label="Advance Analytics" disableRipple sx={tabStyles} />
                    <Tab label="Performance Analytics" disableRipple sx={tabStyles} /> 
                </Tabs>
            </Box>
            <Box sx={{ width: '100%' }}>
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
        </Box>
       
    )
}

export default ProgressList;

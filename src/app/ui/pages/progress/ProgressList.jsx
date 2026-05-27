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
                <Box sx={{ pt: 3 }}>
                    {children}
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
            <Box sx={{
                px: { xs: 1, sm: 2, md: 3 },
                pt: { xs: 2, sm: 3 },
                pb: 0,
            }}>
                {/* Page Header */}
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 700, 
                        color: '#1a1a2e',
                        mb: 0.5,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        letterSpacing: '-0.02em',
                    }}
                >
                    Analytics Dashboard
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: '#6b7280', 
                        mb: 3,
                        fontSize: '0.875rem',
                    }}
                >
                    Monitor performance metrics and track progress across projects
                </Typography>

                {/* Premium Tab Navigation */}
                <Box sx={{
                    borderBottom: '1px solid #e5e7eb',
                    mb: 0,
                }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        aria-label="analytics-tabs" 
                        variant='scrollable'
                        scrollButtons="auto"
                        sx={{
                            minHeight: '44px',
                            '& .MuiTabs-indicator': {
                                height: '2.5px',
                                borderRadius: '2px 2px 0 0',
                                background: 'linear-gradient(90deg, #f97316, #ea580c)',
                            },
                            '& .MuiTabs-flexContainer': {
                                gap: '4px',
                            },
                        }}
                    >
                        {['Task Analytics', 'Meta Analytics', 'Advance Analytics', 'Performance Analytics'].map((label, i) => (
                            <Tab 
                                key={i}
                                label={label} 
                                sx={{ 
                                    fontSize: '0.8125rem',
                                    fontWeight: tabValue === i ? 600 : 500,
                                    color: tabValue === i ? '#1a1a2e' : '#6b7280',
                                    textTransform: 'none',
                                    minHeight: '44px',
                                    px: 2,
                                    py: 0,
                                    mr: '0px !important',
                                    borderRadius: '8px 8px 0 0',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: '#1a1a2e',
                                        backgroundColor: '#f9fafb',
                                    },
                                    '&.Mui-selected': {
                                        color: '#1a1a2e',
                                    },
                                }} 
                            />
                        ))}
                    </Tabs>
                </Box>
            </Box>

            {/* Tab Content */}
            <Box sx={{ 
                px: { xs: 1, sm: 2, md: 3 }, 
                pb: 4,
            }}>
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

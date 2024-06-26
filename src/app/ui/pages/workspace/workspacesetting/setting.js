'use client';
import { Box,Grid,Tab, Card,Tabs, Typography, Divider } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import BasicWorkspaceSettings from '../BasicWorkspaceSettings';
import WorkspaceSetting from '../WorkspaceSetting';
import { fetchWorkspaceDetails } from '@/Lib/Features/getWorkspaceDetails';

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
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const WorkspaceSettingTabs = () => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    const dispatch = useDispatch();

const {id} = useParams();

const workspaceDtails = useSelector(state=>state.getWorkspaceDetails.data);
const getWorkspaceDetails = ()=>{
    dispatch(fetchWorkspaceDetails(id));
  }




    return (
        <Card
        sx={{
            // width: window.innerWidth * 0.8,
            width: "100%",
            minHeight: 500,
            padding: 5
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
                        sx={{mb:3,}}
                    >
                        <Typography variant="h3" gutterBottom component="div"sx={{fontWeight: '1.6875rem'}}>
                        Workspace Settings
                        </Typography>
                    </Grid>
            <Box sx={{mb:2,}} >
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="Basic " sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label=" Advanced " sx={{ fontSize: 17, fontWeight: '700' }} />
                </Tabs>
            </Box>
            <Divider/>
            <Box sx={{ p: 1 }}>
                <TabPanel value={tabValue} index={0}>
                    <BasicWorkspaceSettings />  
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <WorkspaceSetting 
                        title={workspaceDtails && workspaceDtails.workspace_name}
                        createdBy={workspaceDtails && workspaceDtails.created_by?.username}
                        onArchiveWorkspace={()=>getWorkspaceDetails()}
                    />
                </TabPanel>
            </Box>
        </Box>
        </Card>
    )
}

export default WorkspaceSettingTabs
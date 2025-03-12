import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import React from 'react'
import { useState ,useEffect} from 'react'
import BasicSettings from './BasicSettings';
import AdvancedOperation from './AdvancedOperation';
import ReadonlyConfigurations from './ReadOnlyConfigurations';
import ProjectLogs from './ProjectLogs';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { fetchProjectDetails } from '@/Lib/Features/projects/getProjectDetails';


function TabPanel(props) {
         /* eslint-disable react-hooks/exhaustive-deps */

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

const ProjectSetting = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    const ProjectDetails = useSelector((state) => state.getProjectDetails.data);

    const getProjectDetails = () => {

        dispatch(fetchProjectDetails(id));
    }

    useEffect(() => {
        getProjectDetails();
    }, [])
    return (
        <Card
    sx={{
        width: "100%",
        minHeight: 500,
        padding: 5,
        '@media (max-width: 600px)': {
            padding: 2, 
        },
    }}
>
    <Box>
        <Grid
            item
            xs={12}
            sx={{
                mb: 3,
                textAlign: {
                    xs: "center", 
                    sm: "left", 
                },
            }}
        >
            <Typography
                variant="h3"
                gutterBottom
                component="div"
                sx={{
                    fontWeight: 900,
                    fontSize: {
                        xs: "1.5rem", 
                        sm: "1.6875rem", 
                    },
                }}
            >
                Project Settings
            </Typography>
        </Grid>
        <Box sx={{ mb: 2 }}>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="user-tabs"
                variant="scrollable" 
                scrollButtons="auto"
                sx={{
                    '& .MuiTabs-flexContainer': {
                        justifyContent: {
                            xs: 'center',
                            sm: 'flex-start'
                        }
                    }
                }}
            >
                <Tab label="Basic" sx={{ fontSize: 15, fontWeight: 700, marginRight: {sm:6} }} />
                <Tab label="Advanced" sx={{ fontSize: 15, fontWeight: 700, marginRight: {sm:6} }} />
                <Tab label="Read-only" sx={{ fontSize: 15, fontWeight: 700, marginRight: {sm:6} }} />
                <Tab label="Logs" sx={{ fontSize: 15, fontWeight: 700 }} />
            </Tabs>
        </Box>
        <Divider />
        <Box sx={{ p: 1 }}>
            <TabPanel value={tabValue} index={0}>
                <BasicSettings ProjectDetails={ProjectDetails} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <AdvancedOperation />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <ReadonlyConfigurations />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <ProjectLogs />
                </TabPanel>
            </Box>
        </Box>
        </Card>
    )
}

export default ProjectSetting
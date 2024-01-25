import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Tab, Tabs, Box, Typography } from '@mui/material';
import { JSONTree } from 'react-json-tree';
import { snakeToTitleCase } from '../../../../utils/utils';
import {CircularProgress} from '@mui/material';
import CustomizedSnackbars from '@/components/common/Snackbar';
import FetchUserByIdAPI from '../../../actions/api/user/FetchUserByIDAPI.js';
import GetTaskAnnotationsAPI from '../../../actions/api/Dashboard/GetTaskAnnotationsAPI.js';
import GetTaskDetailsAPI from '../../../actions/api/Dashboard/getTaskDetails.js';

function TaskDetails() {
     /* eslint-disable react-hooks/exhaustive-deps */

    const [taskId, setTaskId] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [taskDetails, setTaskDetails] = useState(null);
    const [annotations, setAnnotations] = useState(null);
    const [usersDetails, setUsersDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
      });

    const fetchTaskDetails = async () => {
        setLoading(true);
        setTaskDetails(null);
        setAnnotations(null);
        fetchTaskAnnotations();
        const apiObj = new GetTaskDetailsAPI(taskId);
        fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(async (res) => {
                if(res.status === 200) {
                    const data = await res.json();
                    return data;
                }
                else if(res.status === 404){
                //    const resp = await res.json();
                    setSnackbarInfo({
                        open: true,
                        message: "Task Not Found",
                        variant: "error",
                    })
                    setLoading(false);
                }
                else {
                    const resp = await res.json();
                    setSnackbarInfo({
                        open: true,
                        message: resp?.message,
                        variant: "error",
                    })
                    setLoading(false);
                }
            })
            .then(async (data) => {
                if(data?.error) {
                    setLoading(false);
                    setTaskDetails(data);
                }
                else {
                    const users = await getTaskAssignedUsers(data);
                    setUsersDetails(users);
                    if(data && data['review_user'])
                        data['review_user'] = `${data['review_user']} (${users[1]?.email})`;
                    if(data && data['super_check_user'])
                        data['super_check_user'] = `${data['super_check_user']} (${users[2]?.email})`;
                    if(data && data['annotation_users']?.length)
                        data['annotation_users'][0] = `${data['annotation_users'][0]} (${users[0]?.email})`;
                    setLoading(false);
                    setTaskDetails(data);
                }
            })
    };

    const fetchTaskAnnotations = async () => {
        const apiObj = new GetTaskAnnotationsAPI(taskId);
        fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(async (res) => {
                if(res.status === 200) {
                    const data = await res.json();
                    return data;
                }
                else if(res.status === 404){
                setSnackbarInfo({
                    open: true,
                    message: "Task Not Found",
                    variant: "error",
                })
                setLoading(false)
            }
                else {
                    setSnackbarInfo({
                        open: true,
                        message: "Something Went Wrong",
                        variant: "error",
                    });
                    setLoading(false)
                }
            })
            .then(data => {
                if(data?.error) {
                    setLoading(false);
                    setAnnotations(data);
                }
                else {
                    let displayData = {};
                    data?.forEach((annotation) => {
                        annotation.annotation_type === 1 && (displayData['annotator'] = annotation);
                        annotation.annotation_type === 2 && (displayData['reviewer'] = annotation);
                        annotation.annotation_type === 3 && (displayData['super_checker'] = annotation);
                    });
                    setAnnotations(displayData);
                }
            });
    };

    useEffect(() => {
        if(usersDetails?.length && annotations) {
            if(annotations['annotator'] && annotations['annotator']['completed_by'] === usersDetails[0]?.id)
                annotations['annotator']['completed_by'] = `${annotations['annotator']['completed_by']} (${usersDetails[0]?.email})`;
            if(annotations['reviewer'] && annotations['reviewer']['completed_by'] === usersDetails[1]?.id)
                annotations['reviewer']['completed_by'] = `${annotations['reviewer']['completed_by']} (${usersDetails[1]?.email})`; 
            if(annotations['super_checker'] && annotations['super_checker']['completed_by'] === usersDetails[2]?.id)
                annotations['super_checker']['completed_by'] = `${annotations['super_checker']['completed_by']} (${usersDetails[2]?.email})`;
        };
    }, [usersDetails, annotations]);

    const getTaskAssignedUsers = async (data) => {
        const getAnnotator = async () => {
            if(!(data?.annotation_users?.length))
                return Promise.resolve(null);
            
            const annotatorObj = new FetchUserByIdAPI(data?.annotation_users[0]);
            return fetch(annotatorObj.apiEndPoint(), annotatorObj.getHeaders())
                .then(res => res.json());
        };
    
        const getReviewer = async () => {
            if(!(data?.review_user))
                return Promise.resolve(null);
    
            const reviewerObj = new FetchUserByIdAPI(data?.review_user);
            return fetch(reviewerObj.apiEndPoint(), reviewerObj.getHeaders())
                .then(res => res.json());
        }
    
        const getSuperChecker = async () => {
            if(!(data?.super_check_user))
                return Promise.resolve(null);
            
            const superCheckerObj = new FetchUserByIdAPI(data?.super_check_user);
            return fetch(superCheckerObj.apiEndPoint(), superCheckerObj.getHeaders())
                .then(res => res.json());
        };
    
        return Promise.all([getAnnotator(), getReviewer(), getSuperChecker()]);
    };

    const theme = {
        extend: {
            base00: '#000',
            base01: '#383830',
            base02: '#49483e',
            base03: '#75715e',
            base04: '#a59f85',
            base05: '#f8f8f2',
            base06: '#f5f4f1',
            base07: '#f9f8f5',
            base08: '#f92672',
            base09: '#fd971f', //orange
            base0A: '#f4bf75',
            base0B: '#a6e22e', //green
            base0C: '#a1efe4',
            base0D: '#66d9ef',
            base0E: '#ae81ff',
            base0F: '#cc6633',
          },
        value: ({ style }, nodeType, keyPath) => ({
            style: {
                ...style,
                borderLeft: '2px solid #ccc',
                marginLeft: '1.375em',
                paddingLeft: '2em',
            },
        }),
        nestedNode: ({ style }, nodeType, keyPath) => ({
            style: {
                ...style,
                borderLeft: '2px solid #ccc',
                marginLeft: keyPath.length > 1 ? '1.375em' : 0,
                textIndent: '-0.375em',
            },
            
        }),
        arrowContainer: ({ style }, arrowStyle) => ({
            style: {
                ...style,
                paddingRight: '1.375rem',
                textIndent: '0rem',
                backgroundColor: 'white',
            },
        }),
      };
      const renderSnackBar = () => {
        return (
          <CustomizedSnackbars
            open={snackbar.open}
            handleClose={() =>
              setSnackbarInfo({ open: false, message: "", variant: "" })
            }
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            variant={snackbar.variant}
            message={snackbar.message}
          />
        );
      };
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

    return (
        <Grid container spacing={2}>
            {renderSnackBar()}
            <Grid item xs={12}>
                <Box sx={{display: 'flex', gap: '2em', alignItems: 'center'}}>
                    <TextField
                        id="task-id"
                        label="Task ID"
                        variant="outlined"
                        value={taskId}
                        onChange={(event) => setTaskId(event.target.value)}
                    />
                    <Button variant="contained" onClick={fetchTaskDetails}>
                        Fetch Task Details
                    </Button>
                </Box>
            </Grid>
            {loading && (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 8 }}>
                    <CircularProgress color="primary" size={50} />
                </Grid>
            )}
            {taskDetails && <>
                <Grid item xs={12}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="task-details-tabs">
                        <Tab label="Details" sx={{ fontSize: 17, fontWeight: '400', marginRight: '28px !important' }} />
                        <Tab label="Annotations" sx={{ fontSize: 17, fontWeight: '400', marginRight: '28px !important' }} />
                    </Tabs>
                </Grid>

                <Grid item xs={12}>
                    <TabPanel value={tabValue} index={0}>
                        <JSONTree
                            data={taskDetails}
                            hideRoot={true}
                            invertTheme={true}
                            labelRenderer={([key]) => <strong>{typeof key === "string" ? snakeToTitleCase(key) : key}</strong>}
                            valueRenderer={(raw) => <span>{typeof raw === "string" && raw.match(/^"(.*)"$/) ? raw.slice(1, -1) :  raw}</span>}
                            theme={theme}
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <JSONTree
                            data={annotations}
                            hideRoot={true}
                            invertTheme={true}
                            labelRenderer={([key]) => <strong>{typeof key === "string" ? snakeToTitleCase(key) : key}</strong>}
                            valueRenderer={(raw) => <span>{typeof raw === "string" && raw.match(/^"(.*)"$/) ? raw.slice(1, -1) :  raw}</span>}
                            theme={theme}
                        />
                    </TabPanel>
                </Grid>
            </>}
        </Grid>
    );
}

export default TaskDetails;

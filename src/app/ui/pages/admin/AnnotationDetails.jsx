
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { JSONTree } from 'react-json-tree';
import { snakeToTitleCase } from '../../../../utils/utils.js';
import CustomizedSnackbars from '@/components/common/Snackbar.jsx';
import FetchUserByIdAPI from '../../../actions/api/user/FetchUserByIDAPI.js';
import DeleteAnnotationAPI from '../../../actions/api/Dashboard/DeleteAnnotationAPI.js';
import GetTaskDetailsAPI from '../../../actions/api/Dashboard/getTaskDetails.js';



function AnnotationDetails() {
     /* eslint-disable react-hooks/exhaustive-deps */

    const [annotationId, setAnnotationId] = useState('');
    const [annotationDetails, setAnnotationDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
      });

    const fetchAnnotationDetails = async () => {
        setLoading(true);
        setAnnotationDetails(null);
        //not actually deleting the annotation, just fetching the details
        const apiObj = new DeleteAnnotationAPI(annotationId);
        fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(async (res) => {
                if(res.status === 200) {
                    const data = await res.json();
                    return data;
                }
                else if(res.status === 404){
                    
                setSnackbarInfo({
                    open: true,
                    message: "Annotation Not Found",
                    variant: "error",
                })
                setLoading(false)
            }
                else {
                    setSnackbarInfo({
                        open: true,
                        message: "Something Went Wrong",
                        variant: "error",
                    })
                    setLoading(false)
                }
            })
            .then(async (data) => {
                if(data?.error) {
                    setLoading(false);
                    setAnnotationDetails(data);
                }
                else {
                    if(data){
                    const projectId = await getProjectId(data['task']);
                    data['project_id'] = projectId;
                    if(data['completed_by']) {
                        const userEmail = await getUserEmail(data['completed_by']);
                        data['completed_by'] = `${data['completed_by']} (${userEmail})`;
                        setLoading(false);
                        setAnnotationDetails(data);
                    }
                    else {
                        setLoading(false);
                        setAnnotationDetails(data);
                    }
                }
                }
            });
    };

    const getUserEmail = async (userId) => {
        const apiObj = new FetchUserByIdAPI(userId);
        return fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(res => res.json())
            .then(res => res?.email);
    };

    const getProjectId = async (taskId) => {
        const apiObj = new GetTaskDetailsAPI(taskId);
        return fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(res => res.json())
            .then(res => res?.project_id);
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
                wordBreak:'normal'
            },
        }),
        nestedNode: ({ style }, nodeType, keyPath) => ({
            style: {
                ...style,
                borderLeft: '2px solid #ccc',
                marginLeft: keyPath.length > 1 ? '1.375em' : 0,
                textIndent: '-0.375em',
                wordBreak:'normal'
            },
            
        }),
        arrowContainer: ({ style }, arrowStyle) => ({
            style: {
                ...style,
                paddingRight: '1.375rem',
                textIndent: '0rem',
                backgroundColor: 'white',
                wordBreak:'normal'
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


    return (
        <Grid container>
            {renderSnackBar()}
            <Grid item xs={12}>
                <Box sx={{
                    display: 'flex', 
                    flexDirection:{xs:"column",sm:"row"},
                    gap: '1em', 
                    alignItems: 'center'
                    }}>
                    <TextField
                        id="annotation-id"
                        label="Annotation ID"
                        variant="outlined"
                        value={annotationId}
                        onChange={(event) => setAnnotationId(event.target.value)}
                        sx={{
                            width:{xs:"100%",sm:"400px"}
                        }}
                    />
                    <Button 
                    variant="contained" 
                    onClick={fetchAnnotationDetails}
                    sx={{
                        width:{xs:"100%",sm:"200px"}
                    }}
                    >
                        Fetch Annotation Details
                    </Button>
                </Box>
            </Grid>
            {loading && (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 8 }}>
                    <CircularProgress color="primary" size={50} />
                </Grid>
            )}
            {annotationDetails && 
                <Grid item xs={12}>
                    <Box 
                        sx={{
                         fontSize:{xs:".75rem", sm:"1rem"},
                         display:"flex",
                         flexDirection:"column",
                         gap:"1em"
                     }}
                    >
                    <JSONTree
                        data={annotationDetails}
                        hideRoot={true}
                        invertTheme={true}
                        labelRenderer={([key]) => <strong>{typeof key === "string" ? snakeToTitleCase(key) : key}</strong>}
                        valueRenderer={(raw) => <span>{typeof raw === "string" && raw.match(/^"(.*)"$/) ? raw.slice(1, -1) :  raw}</span>}
                        theme={theme}
                    />
                    </Box>
                </Grid>
            }
        </Grid>
    );
}

export default AnnotationDetails;

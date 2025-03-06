'use client';
import { Box,  ThemeProvider, Typography} from "@mui/material";
import React, { useState, useEffect } from "react";
import themeDefault from  "@/themes/theme";
import  "@/styles/Dataset.css";
import componentType from "@/config/PageType";
import DetailsViewPage from "./DetailsViewPage";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";


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
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function Workspace(props){
    
    const {id} = useParams();
    const dispatch=useDispatch();
     
   
   
    const workspaceDtails = useSelector(state=>state.getWorkspaceDetails?.data);
    const getWorkspaceDetails = ()=>{
        dispatch(fetchWorkspaceDetails(id));
      }
     
      
      useEffect(()=>{
        getWorkspaceDetails();
      },[]);

    
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    
    return (
        <ThemeProvider theme={themeDefault}>
             <DetailsViewPage 
               title={workspaceDtails && workspaceDtails.workspace_name}
               createdBy={workspaceDtails && workspaceDtails.created_by ?.username}
               pageType = {componentType.Type_Workspace}
               onArchiveWorkspace={()=>getWorkspaceDetails()}

            />
        </ThemeProvider>

    )
}


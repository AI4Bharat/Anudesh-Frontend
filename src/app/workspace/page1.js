'use client';
import { Box, Card, Grid, Tab, Tabs, ThemeProvider, Typography} from "@mui/material";
import React, { useState, useEffect } from "react";
import themeDefault from  "@/themes/theme";
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import Button from "../../component/common/Button"
// import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "@/styles/Dataset";
// import TextareaAutosize from '@mui/material/TextareaAutosize';
// import ProjectTable from './Tabs/ProjectTable';
// import AnnotatorsTable from "./Tabs/Annotators";
// import ManagersTable from "./Tabs/ManagersTable";
// import SettingsTable from "./Tabs/SettingsTable";
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
// import GetWorkspacesDetailsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceDetails";
import componentType from "../../config/PageType";


import DetailsViewPage from "../workspace/DetailsViewPage";



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
    const classes = DatasetStyle();
   

    
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
     
   
   
    // const workspaceDtails = useSelector(state=>state.getWorkspaceDetails.data);
    // const getWorkspaceDetails = ()=>{
    //     const workspaceObj = new GetWorkspacesDetailsAPI(id);
    //     dispatch(APITransport(workspaceObj));
    //   }
     
      
    //   useEffect(()=>{
    //     getWorkspaceDetails();
    //   },[]);
        
    return (
        <ThemeProvider theme={themeDefault}>
             <DetailsViewPage 
                pageType = {componentType.Type_Workspace}
            />
        </ThemeProvider>

    )
}


import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {useDispatch,useSelector} from 'react-redux';
import { useNavigate } from "react-router-dom";
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../utils/UserMappedByRole";
import CustomButton from "../common/Button";
import OutlinedTextField from "../common/OutlinedTextField";
import { Divider, Grid, Typography } from "@mui/material";
import { FetchEditOrganization } from "@/Lib/Features/user/EditOrganization";
// import EditOrganizationAPI from "../../../../redux/actions/api/Organization/EditOrganization";

const OrganizationSettings = (props) => {
    const dispatch = useDispatch();
    const [organizationName, setOrganizationName] = useState("");
    let navigate = useNavigate();
        
    const orgId = useSelector(state=>state.getLoggedInData.data.organization.id);
    const orgName = useSelector(state=>state.getLoggedInData.data.organization.title);


    const onSubmitClick = ()=>{
               
        dispatch(FetchEditOrganization({ orgId, organizationName}));
        
        navigate(`/organizations/${orgId}`)

    }


    useEffect(()=>{
        setOrganizationName(orgName ? orgName : "");
    },[]);

    return (
        <Grid
            container
            direction={"column"}
            sx={{
                alignItems : "center",
                justifyContent : "center"
            }}
        >
                <Typography variant="h4">Edit Organization</Typography>
                <OutlinedTextField 
                    value={organizationName}
                    onChange={e=>setOrganizationName(e.target.value)}
                    sx={{width : "100%", mt : 5}} 
                    placeholder = "Organization Name..." 
                    />
                <CustomButton 
                    label={"Change"} 
                    onClick={()=>onSubmitClick()}
                    sx={{mt:5, width : "100%", borderRadius : 2}} 
                />
            
        </Grid>
            
       
    )
}

export default OrganizationSettings;
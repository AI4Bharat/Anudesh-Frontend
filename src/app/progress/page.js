'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Avatar, Card, CardContent, Chip, Grid, Typography, Switch, FormControlLabel, Tooltip, Paper } from '@mui/material';
import MyProgress from '../../components/Tabs/MyProgress';
import RecentTasks from '../../components/Tabs/RecentTasks';
import Spinner from "../../components/common/Spinner";
import userRole from "../../utils/Role";


export default function ProgressPage () {


  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const loggedInUserData= {
    "id": 1,
    "username": "shoonya",
    "email": "shoonya@ai4bharat.org",
    "languages": [],
    "availability_status": 1,
    "enable_mail": false,
    "first_name": "Admin",
    "last_name": "AI4B",
    "phone": "",
    "profile_photo": "",
    "role": 6,
    "organization": {
        "id": 1,
        "title": "AI4Bharat",
        "email_domain_name": "ai4bharat.org",
        "created_by": {
            "username": "shoonya",
            "email": "shoonya@ai4bharat.org",
            "first_name": "Admin",
            "last_name": "AI4B",
            "role": 6
        },
        "created_at": "2022-04-24T13:11:30.339610Z"
    },
    "unverified_email": "shoonya@ai4bharat.org",
    "date_joined": "2022-04-24T07:40:11Z",
    "participation_type": 3,
    "prefer_cl_ui": false,
    "is_active": true
};

  const userDetails= {
    "id": 1,
    "username": "shoonya",
    "email": "shoonya@ai4bharat.org",
    "languages": [],
    "availability_status": 1,
    "enable_mail": false,
    "first_name": "Admin",
    "last_name": "AI4B",
    "phone": "",
    "profile_photo": "",
    "role": 6,
    "organization": {
        "id": 1,
        "title": "AI4Bharat",
        "email_domain_name": "ai4bharat.org",
        "created_by": {
            "username": "shoonya",
            "email": "shoonya@ai4bharat.org",
            "first_name": "Admin",
            "last_name": "AI4B",
            "role": 6
        },
        "created_at": "2022-04-24T13:11:30.339610Z"
    },
    "unverified_email": "shoonya@ai4bharat.org",
    "date_joined": "2022-04-24T07:40:11Z",
    "participation_type": 3,
    "prefer_cl_ui": false,
    "is_active": true
};


  return (
      <Grid container spacing={2}>
        {loading && <Spinner />} 
          {userDetails && (
            <>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
                <Paper variant="outlined" sx={{ minWidth: 275, borderRadius: "5px" ,backgroundColor:'ButtonHighlight', textAlign:'center'}}>
                  <CardContent>
                    <Typography variant="h4">{userDetails.organization.title}</Typography>
                  </CardContent>
                </Paper>
              </Grid>
              {((userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role )||(LoggedInUserId === userDetails?.id && (userRole.Annotator === loggedInUserData?.role || userRole.Reviewer === loggedInUserData?.role || userRole.SuperChecker === loggedInUserData?.role ) )) ?
              <>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ p: 2 , display:'flex', justifyContent:'center' }}>
                  
                  <Card>
                    <CardContent>
                      <Typography variant="h4" sx={{mb: 1}}>Recent Tasks</Typography>
                      <RecentTasks />
                    </CardContent>
                  </Card> 
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ p: 2 }}>
                <Card sx={{ minWidth: 275, borderRadius: "5px" }}>
                  <CardContent>
                    <Typography variant="h4" sx={{mb: 1}}>My Progress</Typography>
                    <MyProgress />
                  </CardContent>
                </Card>
              
              </Grid>
              </>:
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 1, display:'flex', justifyContent:'center', color: 'red'  }}>
                  <Typography variant="h4" sx={{mb: 1}}>{"Not Authorised to View Details"}</Typography>
              </Grid>
              }
              </>
          )}
      </Grid>
  )
}


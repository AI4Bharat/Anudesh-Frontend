'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Avatar, Card, CardContent, Chip, Grid, Typography, Switch, FormControlLabel, Tooltip, Paper } from '@mui/material';
import MyProgress from '../../components/Tabs/MyProgress';
import RecentTasks from '../../components/Tabs/RecentTasks';
import Spinner from "../../components/common/Spinner";
import userRole from "../../utils/Role";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate, useParams} from "react-router-dom"
import ToggleMailsAPI from '../actions/api/user/ToggleMailsAPI';
import { fetchUserById } from '@/Lib/Features/user/getUserById';
import CustomizedSnackbars from '../../components/common/Snackbar';

export default function ProgressPage () {
  const { id } = useParams();
  // const id = 1;
  const dispatch = useDispatch();
   /* eslint-disable react-hooks/exhaustive-deps */

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });


  const UserDetails = useSelector((state) => state.getUserById.data);
  const LoggedInUserId = useSelector((state) => state.getLoggedInData.data.id);
  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);
  const handleEmailToggle = async () => {
    setLoading(true);
    const mailObj = new ToggleMailsAPI(LoggedInUserId, !userDetails.enable_mail);
    const res = await fetch(mailObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(mailObj.getBody()),
        headers: mailObj.getHeaders().headers,
    });
    const resp = await res.json();
    // setLoading(false);
    if (res.ok) {
        setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "success",
        })
        dispatch(fetchUserById(id));
    } else {
        setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "error",
        })
    }
  }

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
  
  useEffect(() => {
    // setLoading(true);
    dispatch(fetchUserById(id));
  }, [id]);

  useEffect(() => {
    if(UserDetails && UserDetails.id == id) {
      setUserDetails(UserDetails);
      // setLoading(false);
    }
  }, [UserDetails]);

  return (
      <Grid container spacing={2}>
        {loading && <Spinner />} 
        {renderSnackBar()}
          {/* {userDetails && ( */}
            <>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
                <Paper variant="outlined" sx={{ minWidth: 275, borderRadius: "5px" ,backgroundColor:'ButtonHighlight', textAlign:'center'}}>
                  <CardContent>
                    <Typography variant="h4">{userDetails?.organization.title}</Typography>
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
                  <Typography variant="h4" sx={{mb: 1}}>{LoggedInUserId===userDetails.id?  "My Progress": `Progress of ${userDetails?.first_name} ${userDetails?.last_name}` }</Typography>
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
          {/* )} */}
      </Grid>
  )
}


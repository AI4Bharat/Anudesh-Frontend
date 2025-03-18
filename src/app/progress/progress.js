'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Box,Card, CardContent, Grid, Typography,Paper } from '@mui/material';
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


  const LoggedInUserId = useSelector((state) => state.getLoggedInData.data.id);
  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);
  if(loggedInUserData?.id==id){
    var UserDetails = useSelector((state) => state.getLoggedInData.data);

  }else{
    var UserDetails = useSelector((state) => state.getUserById.data);

  }

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
    dispatch(fetchUserById(id));
  }, [id]);

  useEffect(() => {
    if(UserDetails && UserDetails.id == id) {
      setUserDetails(UserDetails);
      // setLoading(false);
    }
  }, [UserDetails]);

  return (
    <Grid container>
      {loading && <Spinner />}
      {renderSnackBar()}
  
      <>
        {/* Organization Title */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{
            mx: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              minWidth: 275,
              borderRadius: "5px",
              backgroundColor: "ButtonHighlight",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography variant="h4">{userDetails?.organization?.title}</Typography>
            </CardContent>
          </Paper>
        </Grid>
  
        {/* Conditional rendering based on user role */}
        {((userRole.WorkspaceManager === loggedInUserData?.role ||
          userRole.OrganizationOwner === loggedInUserData?.role ||
          userRole.Admin === loggedInUserData?.role) ||
          (LoggedInUserId === userDetails?.id &&
            (userRole.Annotator === loggedInUserData?.role ||
              userRole.Reviewer === loggedInUserData?.role ||
              userRole.SuperChecker === loggedInUserData?.role))) ? (
          <Grid container sx={{ margin: "none" }}>
            {/* Recent Tasks */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              sx={{
                py: 2,
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              }}
            >
              <Card
                sx={{
                  borderRadius: "5px",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: 5,
                    }}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        flex: 1,
                        border: "none",
                        borderRadius: "10px",
                        p: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          fontSize: { xs: "1rem", sm: "1.2rem" },
                        }}
                      >
                        Recent Tasks
                      </Typography>
                      <RecentTasks />
                    </Card>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
  
            {/* My Progress */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              sx={{
                py: 2,
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              }}
            >
              <Card
                sx={{
                  borderRadius: "5px",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: 5,
                    }}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        flex: 1,
                        border: "none",
                        borderRadius: "10px",
                        p: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          fontSize: { xs: "1rem", sm: "1.2rem" },
                        }}
                      >
                        {LoggedInUserId === userDetails?.id
                          ? "My Progress"
                          : `Progress of ${userDetails?.first_name} ${userDetails?.last_name}`}
                      </Typography>
                      <MyProgress />
                    </Card>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "center",
              color: "red",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, fontWeight: 500 }}
            >
              Not Authorised to View Details
            </Typography>
          </Grid>
        )}
      </>
    </Grid>
  );
}  


'use client';
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import { Input } from '@mui/base/Input';
import CustomButton from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import UserMappedByRole from '../../utils/UserMappedByRole';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import FiberPinOutlinedIcon from '@mui/icons-material/FiberPinOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import Filter1OutlinedIcon from '@mui/icons-material/Filter1Outlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import CustomizedSnackbars from "../../components/common/Snackbar";
import userRole from "../../utils/Role";
import ScheduleMails from '@/components/UserManagement/ScheduleMails';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ToggleMailsAPI from '../actions/api/user/ToggleMailsAPI';
import UpdateProfileImageAPI from '../actions/api/user/UpdateProfileImageAPI'
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from '@/Lib/Features/user/getUserById';
import ReportBarGraph from '../../components/UserManagement/ProfileDetails';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@mui/material/styles';
import tableTheme from "../../themes/tableTheme";
import { getUserProjects } from '@/Lib/Features/projects/bookmarkService';
import BookmarkButton from "@/components/Project/BookmarkButton";
import { Box } from "@mui/material";

const MUIDataTable = dynamic(
  () => import('mui-datatables'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

export default function ProfilePage() {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  /* eslint-disable react-hooks/exhaustive-deps */
  const LoggedInUserId = useSelector((state) => state.getLoggedInData.data.id);
  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);
  if (loggedInUserData?.id == id) {
    var UserDetails = useSelector((state) => state.getLoggedInData.data);

  } else {
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
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      })
      dispatch(fetchUserById(id))
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

  const onImageChangeHandler = async (event) => {
    if (event.target.files && event.target.files.length !== 0) {
      setLoading(true);
      let pickedFile = event.target.files[0];
      const updateProfileImageAPIObj = new UpdateProfileImageAPI(LoggedInUserId, pickedFile);
      await axios.post(updateProfileImageAPIObj.apiEndPoint(), updateProfileImageAPIObj.getBody(), updateProfileImageAPIObj.getHeaders())
        .then(response => {
          if (response.status == 200 || response.status == 201) {
            dispatch(fetchUserById(id))
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(err => {
          setLoading(false);
        })
    }
  }
  console.log(UserDetails.languages);


  useEffect(() => {
    setLoading(true);
    dispatch(fetchUserById(id))
  }, [id]);

  useEffect(() => {
    if (UserDetails && UserDetails.id == id) {
      setUserDetails(UserDetails);
      setLoading(false);
    }
  }, [UserDetails]);

  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [bookmarkedLoading, setBookmarkedLoading] = useState(false);

  const fetchBookmarkedProjects = async () => {
    setBookmarkedLoading(true);
    try {
      const data = await getUserProjects();
      // Extract the results array from the paginated response
      setBookmarkedProjects(data.results || []);
    } catch (error) {
      console.error('Error fetching bookmarked projects:', error);
      setSnackbarInfo({
        open: true,
        message: "Failed to fetch bookmarked projects",
        variant: "error",
      });
    }
    setBookmarkedLoading(false);
  };


  useEffect(() => {
    if (userDetails?.id) {
      fetchBookmarkedProjects();
    }
  }, [userDetails?.id]);

  const bookmarkedColumns = [
    {
      name: "id",
      label: "Project Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "title",
      label: "Project Title",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "project_type",
      label: "Project Type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "project_stage",
      label: "Project Stage",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "tgt_language",
      label: "Target Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "workspace_id",
      label: "Workspace Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
  {
    name: "action",
    label: "Action",
    options: {
      filter: false,
      sort: false,
      align: "center",
      customBodyRender: (value, tableMeta) => {
        const rowData = tableMeta.rowData;
        const projectId = rowData[0]; 
        
        return (
          <div style={{display:"flex", wordBreak:"normal"}}>
            <Link to={`/projects/${projectId}`} style={{ textDecoration: "none" }}>
              <CustomButton
                sx={{ borderRadius: 2, marginRight: 2 }}
                label="View"
              />
            </Link>
              <BookmarkButton
                projectId={projectId}
                onBookmarkChange={handleBookmarkChange}
              />
          </div>
        );
      },
      setCellProps: () => ({
        style: {
          height: "70px",
          fontSize: "16px",
          padding: "16px",
          whiteSpace: "normal",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }
      }),
    },
  }

  ];

  const bookmarkedTableOptions = {
    textLabels: {
      body: {
        noMatch: "No bookmarked projects found",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [5, 10, 25],
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    responsive: "vertical",
  };

  const handleBookmarkChange = (projectId, bookmarked) => {
    if (!bookmarked) {
      setBookmarkedProjects((prev) =>
        prev.filter((proj) => proj.id !== projectId)
      );
    }
  };





  return (
    <Grid container >
      {renderSnackBar()}
      {loading ? (<Spinner />) :

        <>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{
            mx: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          }}>
            <Paper variant="outlined" sx={{ minWidth: 275, borderRadius: "5px", backgroundColor: 'ButtonHighlight', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4">{userDetails?.organization?.title}</Typography>
              </CardContent>
            </Paper>
          </Grid>
          <Grid container sx={{ margin: "none"}}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{
              // mx: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
              py: 2,
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            }}>
              <Card sx={{
                borderRadius: "5px",
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', }}>
                  <div style={{ display: "flex", flexDirection: 'row', border: "none", textAlign: "center", justifyContent: "center", gap: 5 }}>
                    <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', border: "none" }}>
                      <Input accept="image/*" id="upload-avatar-pic" type="file" hidden onChange={onImageChangeHandler} />
                      <label htmlFor="upload-avatar-pic">
                        <IconButton component="span">
                          <Avatar
                            alt="user_profile_pic"
                            variant="contained"
                            src={userDetails?.profile_photo ? userDetails?.profile_photo : ''}
                            sx={{ color: "#FFFFFF !important", bgcolor: "#2A61AD !important", alignSelf: 'center' }}
                          >
                            {userDetails?.username.split("")[0]}
                          </Avatar>
                        </IconButton>
                      </label>
                    </Card>

                    <Typography variant="subtitle1" sx={{ alignSelf: 'center', textAlign: 'center', fontWeight: "bold", fontFamily: "'Rowdies', 'cursive', Roboto, 'sans-serif'", fontSize: { xs: "1.3rem", sm: "1.2rem", md: "1.2rem", lg: "1.4rem", xl: "2rem" } }}>
                      {userDetails?.username}
                    </Typography>
                    <Typography variant="h2" sx={{ alignSelf: 'center', mb: 2, ml: 3 }}>
                      {UserMappedByRole(userDetails?.role)?.element}
                    </Typography>
                  </div>
                  <Grid container  >

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                        <EmailOutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /> <span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}>{userDetails?.email}</span>
                      </Typography>
                    </Grid>
                    {userDetails?.phone && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <LocalPhoneOutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /> <span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}> {userDetails?.phone}</span>
                        </Typography>
                      </Grid>
                    )}
                    {userDetails?.gender && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <Person2OutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /><span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}> {userDetails?.gender == "F" ? "Female" : userDetails?.gender == "M" ? "Male" : null}</span>
                        </Typography>
                      </Grid>
                    )}
                    {userDetails?.city && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <LocationCityOutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /><span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}> {userDetails?.city}</span>
                        </Typography>
                      </Grid>
                    )}
                    {userDetails?.address && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <LocationOnOutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /><span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}> {userDetails?.address}</span>
                        </Typography>
                      </Grid>
                    )}
                    {userDetails?.state && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <GpsFixedOutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /><span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}>  {userDetails?.state}</span>
                        </Typography>
                      </Grid>
                    )}
                    {userDetails?.pin_code && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <FiberPinOutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /><span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}>  {userDetails?.pin_code}</span>
                        </Typography>
                      </Grid>
                    )}
                    {userDetails?.age && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <Filter1OutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /><span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}>  {userDetails?.age}</span>
                        </Typography>
                      </Grid>
                    )}
                    {userDetails?.qualification && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <SchoolOutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /><span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}>  {userDetails?.qualification}</span>
                        </Typography>
                      </Grid>
                    )}
                    {userDetails?.organization && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <Diversity3OutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /><span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}> {userDetails?.organization?.title}</span>
                        </Typography>
                      </Grid>
                    )}
                    {userDetails?.participation_type && (
                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body1" sx={{ display: "flex", gap: "5px", fontSize: { xs: "0.85rem", sm: "0.85rem", md: "1rem", lg: "1rem", xl: "1rem" }, p: 0.4 }}>
                          <Diversity2OutlinedIcon sx={{ fontSize: "1.7rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "5px", color: "white", padding: "3px" }} /><span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "0.2rem 0.5rem 0.2rem 0.5rem", borderRadius: "3px" }}> {userDetails?.participation_type == 1 ? "Full Time" : userDetails?.participation_type == 2 ? "Part Time" : null}</span>
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  {(userRole.WorkspaceManager === loggedInUserData?.role ||
                    userRole.OrganizationOwner === loggedInUserData?.role ||
                    userRole.Admin === loggedInUserData?.role ||
                    loggedInUserData?.id === userDetails?.id) && (
                      <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item xs={2} sm={2} md={4} lg={4} xl={4}>
                          <Tooltip title={(userDetails?.enable_mail ? "Disable" : "Enable") + " daily mails"}>
                            <FormControlLabel
                              control={<Switch color="primary" />}
                              label="Daily Mails"
                              labelPlacement="start"
                              checked={userDetails?.enable_mail}
                              onChange={handleEmailToggle}
                            />
                          </Tooltip>
                        </Grid>
                        <Grid item xs={10} sm={10} md={4} lg={4} xl={4}>
                          <CustomButton sx={{ width: "100%" }} label="View Progress" onClick={() => navigate(`/progress/${userDetails?.id}`)} />
                        </Grid>
                        {LoggedInUserId === userDetails?.id &&
                          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <CustomButton
                              sx={{ width: "100%" }}
                              label="Edit Profile"
                              onClick={() => navigate("/edit-profile")}
                            />
                          </Grid>}

                      </Grid>)}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}
              sx={{
                // mx: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                py: 2,
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
              }}
            >
              <Card sx={{ borderRadius: "5px", mb: 2 }}>
                <ReportBarGraph id={id} />
              </Card>
            </Grid>
          </Grid>
          {LoggedInUserId === userDetails?.id && (userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role) &&
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
              <Card sx={{ borderRadius: "5px", mb: 2 }}>
                <ScheduleMails />
              </Card>
            </Grid>
          }

          {LoggedInUserId === userDetails?.id && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
              <Card sx={{ borderRadius: "5px", mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Bookmarked Projects
                  </Typography>
                  {bookmarkedLoading ? (
                    <Spinner />
                  ) : (
                    <ThemeProvider theme={tableTheme}>
                      <MUIDataTable
                        title=""
                        data={bookmarkedProjects}
                        columns={bookmarkedColumns}
                        options={bookmarkedTableOptions}
                      />
                    </ThemeProvider>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}


        </>
      }
    </Grid >

  )
}
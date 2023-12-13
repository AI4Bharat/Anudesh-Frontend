'use client';
import React, { useState,useEffect } from 'react';
import { Avatar,Select,OutlinedInput,MenuItem, IconButton, Box,ThemeProvider,Card, CardContent, Chip, Grid, Typography, Switch, FormControlLabel, Tooltip, Paper,InputLabel } from '@mui/material';
import { Input, inputClasses } from '@mui/base/Input';
import themeDefault from "../../themes/theme";
import OutlinedTextField from "../components/common/OutlinedTextField";
import CustomButton from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import UserMappedByRole from '../../utils/UserMappedByRole';
import {participationType} from '../../config/dropDownValues';
import CustomizedSnackbars from "../components/common/Snackbar";
import userRole from "../../utils/Role";
import ProfileDetails from "../components/UserManagement/ProfileDetails"
import ScheduleMails from "../components/UserManagement/ScheduleMails"

export default function ProfilePage () {

  const id=1;
  const [newDetails, setNewDetails] = useState();
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [initLangs, setInitLangs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
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
const LoggedInUserId=1
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

  return (
    <ThemeProvider theme={themeDefault}>

    <Grid container spacing={2}>
      {loading && <Spinner />}
      {/* {renderSnackBar()} */}
      {userDetails && (
        <>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
            <Paper variant="outlined" sx={{ minWidth: 275, borderRadius: "5px", backgroundColor: 'ButtonHighlight', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4">{userDetails.organization.title}</Typography>
              </CardContent>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{ p: 2 }}>
            <Card sx={{ borderRadius: "5px", mb: 2 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', border: "none" }}>
                  <Input accept="image/*" id="upload-avatar-pic" type="file" hidden
                  //  onChange={onImageChangeHandler}
                   />
                  <label htmlFor="upload-avatar-pic">
                      <IconButton component="span">
                          <Avatar
                            alt="user_profile_pic"
                            variant="contained"
                            src={userDetails?.profile_photo?userDetails.profile_photo:''}
                            sx={{ color: "#FFFFFF !important", bgcolor: "#2A61AD !important", width: 96, height: 96, mb: 2, alignSelf: 'center' }}
                          >
                            {userDetails.username.split("")[0]}
                          </Avatar>
                      </IconButton>
                  </label>
                  <Typography variant="h3" sx={{ alignSelf: 'center', mb: 2 }}>
                    {UserMappedByRole(userDetails.role).element}
                  </Typography>

                </Card>
                <Typography variant="h3" sx={{ mb: 1, alignSelf: 'center', textAlign: 'center' }}>
                  {userDetails.first_name} {userDetails.last_name}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1, alignSelf: 'center', textAlign: 'center' }}>
                  {userDetails.username}
                </Typography>
                <Card style={{ alignSelf: 'center', border: "none", boxShadow: "none", alignItems: "center", textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <MailOutlineIcon />{userDetails.email}
                  </Typography>
                  {userDetails.phone && <Typography variant="body1" sx={{ alignItems: "center", alignSelf: 'center' }}>
                    <PhoneOutlinedIcon />{userDetails.phone}
                  </Typography>}
                </Card>
                {userDetails.languages.length > 0 && (
                  <Typography variant="body1" sx={{ display: "flex", gap: "5px", alignItems: "center", alignSelf: 'center', textAlign: 'center' }}>Languages:
                    {userDetails.languages.map
                      (lang => <Chip label={lang} variant="outlined" sx={{ ml: 1 }}></Chip>
                      )}
                  </Typography>
                )}
                {/* {LoggedInUserId === userDetails.id && */}
                {(userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role || LoggedInUserId === userDetails?.id) &&
                  <Grid container spacing={2} sx={{ mt: 1, alignItems: "center", display: 'inline-flex', justifyContent: 'center' }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Tooltip title={(userDetails.enable_mail ? "Disable" : "Enable") + " daily mails"}>
                        <FormControlLabel
                          control={<Switch color="primary" />}
                          label="Daily Mails"
                          labelPlacement="start"
                          checked={userDetails.enable_mail}
                          // onChange={handleEmailToggle}
                        />
                      </Tooltip>
                    </Grid>
                    {/* <Grid item>
                          <CustomButton
                            label="Edit Profile"
                            onClick={() => navigate("/edit-profile")}
                          />
                        </Grid> */}
                    <Grid item>
                      <CustomButton
                        label="View Progress"
                        // onClick={() => navigate(`/progress/${UserDetails.id}`)}
                      />
                    </Grid>
                  </Grid>
                  }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8} sx={{ p: 2 }}>
            {/* {((userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role )||(LoggedInUserId === userDetails?.id && userRole.Annotator === loggedInUserData?.role))  &&
                <Card sx={{ minWidth: 275, borderRadius: "5px" }}>
                  <CardContent>
                    <Typography variant="h4" sx={{mb: 1}}>My Progress</Typography>
                    <MyProgress />
                  </CardContent>
                </Card>
                }   */}
            <Card sx={{ borderRadius: "5px", mb: 2 }}>
              {/* <ProfileDetails/> */}
              <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            // width: window.innerWidth * 0.8,
            width: "100%",
            minHeight: 500,
            padding: 5,
            border: 0,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h3" align="center">
                Profile Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="First Name"
                name="first_name"
                value={newDetails?.first_name}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Last Name"
                name="last_name"
                value={newDetails?.last_name}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Email"
                value={email}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Phone"
                name="phone"
                value={newDetails?.phone}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Role"
                value={UserMappedByRole(userDetails.role)?.name}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                required
                fullWidth
                label="Username"
                name="username"
                value={newDetails?.username}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Organization"
                value={userDetails.organization?.title}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            
          
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <InputLabel id="lang-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Languages</InputLabel>
              <Select
                disabled
                multiple
                fullWidth
                labelId="lang-label"
                name="languages"
                value={newDetails?.languages? newDetails.languages : []}
                style={{zIndex: "0"}}
                // MenuProps={MenuProps}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {initLangs?.length && initLangs.map((lang) => (
                  <MenuItem
                    key={lang}
                    value={lang}
                  >
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Availability Status"
                name="availability_status"
                value={newDetails?.availability_status}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <InputLabel id="lang-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Participation Type</InputLabel>
              <Select
                disabled
                fullWidth
                labelId="lang-label"
                name="participation_type"
                value={newDetails?.participation_type? newDetails.participation_type : []}
                style={{zIndex: "0"}}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              >
                {participationType?.length && participationType.map((type,i) => (
                  <MenuItem
                    key={i+1}
                    value={i+1}
                  >
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid 
                container 
                direction="row"
                justifyContent="flex-end"
                style={{marginTop: 20}}
            >
                {LoggedInUserId === userDetails.id &&
                    <Grid item>
                        <CustomButton
                        label="Edit Profile"
                        // onClick={() => navigate("/edit-profile")}
                        />
                    </Grid> }
            </Grid>
          </Grid>
        </Card>
      </Grid>

            </Card>
          </Grid>
          {LoggedInUserId === userDetails?.id && (userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role) &&
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
              <Card sx={{ borderRadius: "5px", mb: 2 }}>
                <ScheduleMails />
              </Card>
            </Grid>
          }
        </>
      )}
    </Grid>
    </ThemeProvider>

  )
}


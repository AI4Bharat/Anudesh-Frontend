import React, { useEffect, useState } from "react";
import { Button, Card, CircularProgress, Grid, ThemeProvider, Typography, Select, OutlinedInput, Box, Chip, MenuItem, InputLabel, InputAdornment } from "@mui/material";
import OutlinedTextField from "../../components/common/OutlinedTextField";
import themeDefault from "../../../themes/theme";
// import { useNavigate, useParams } from 'react-router-dom';
// import { useSelector, useDispatch } from "react-redux";
// import FetchLanguagesAPI from "../../../../redux/actions/api/UserManagement/FetchLanguages.js";
// import UpdateProfileAPI from "../../../../redux/actions/api/UserManagement/UpdateProfile";
// import UpdateEmailAPI from "../../../../redux/actions/api/UserManagement/UpdateEmail";
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import Snackbar from "../../components/common/Snackbar";
// import UpdateEmailDialog from "../../component/common/UpdateEmailDialog"
import UserMappedByRole from "../../../utils/UserMappedByRole";
import {participationType} from '../../../config/dropDownValues';
// import { MenuProps } from "../../../../utils/utils";
import CustomButton from "../../components/common/Button";

const ProfileDetails = () => {
//   const { id } = useParams();
  const [newDetails, setNewDetails] = useState();
  const [initLangs, setInitLangs] = useState([]);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: ''});
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [enableVerifyEmail, setEnableVerifyEmail] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);

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
const LanguageList =[]

 
  
  return (
    <ThemeProvider theme={themeDefault}>
      {/* <Header /> */}
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
                value={userDetails?.first_name}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Last Name"
                name="last_name"
                value={userDetails?.last_name}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Email"
                value={userDetails?.email}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Phone"
                name="phone"
                value={userDetails?.phone}
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
                value={userDetails?.username}
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
            
            {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <InputLabel id="availability-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Availability Status</InputLabel>
              <Select
                fullWidth
                labelId="availability-label"
                name="availability_status"
                value={newDetails?.availability_status}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="1">Available</MenuItem>
                <MenuItem value="2">Unavailable</MenuItem>
              </Select>
            </Grid> */}
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <InputLabel id="lang-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Languages</InputLabel>
              <Select
                disabled
                multiple
                fullWidth
                labelId="lang-label"
                name="languages"
                value={userDetails?.languages? userDetails.languages : []}
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
                value={userDetails?.availability_status}
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
                value={userDetails?.participation_type? userDetails.participation_type : []}
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
      {/* <Snackbar 
        {...snackbarState} 
        handleClose={()=> setSnackbarState({...snackbarState, open: false})} 
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        hide={2000}
      /> */}
    </ThemeProvider>
  );
};

export default ProfileDetails;

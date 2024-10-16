import React, { useEffect, useState } from "react";
import { Button, Card, CircularProgress, Grid, ThemeProvider, Typography, Select, OutlinedInput, Box, Chip, MenuItem, InputLabel, InputAdornment } from "@mui/material";

import OutlinedTextField from "../../components/common/OutlinedTextField";
import themeDefault from "../../themes/theme";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import FetchLanguagesAPI from "@/app/actions/api/workspace/FetchLanguagesAPI";
import UpdateProfileAPI from "@/app/actions/api/user/UpdateProfileImageAPI";
import UpdateEmailAPI from "@/app/actions/api/user/UpdateEmailAPI";
import Snackbar from "../../components/common/Snackbar";
import APITransport from "@/Lib/apiTransport/apitransport";
import UpdateEmailDialog from "../../components/common/UpdateEmailDialog"
import UserMappedByRole from "../../utils/UserMappedByRole";
import {participationType} from '../../config/dropDownValues';
import { MenuProps } from "../../utils/utils";
import CustomButton from "../../components/common/Button";
import {fetchLanguages} from "@/Lib/Features/fetchLanguages";

const ProfileDetails = () => {
  const { id } = useParams();
const [newDetails, setNewDetails] = useState();
const [initLangs, setInitLangs] = useState([]);
const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: ''});
const [email, setEmail] = useState("");
const [originalEmail, setOriginalEmail] = useState("");
const [enableVerifyEmail, setEnableVerifyEmail] = useState(false);
const [showEmailDialog, setShowEmailDialog] = useState(false);
const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
const navigate = useNavigate();
/* eslint-disable react-hooks/exhaustive-deps */

// const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
const userDetails = useSelector((state) => state.getUserById?.data);
const LoggedInUserId = useSelector((state) => state.getLoggedInData?.data.id);
const dispatch = useDispatch();
const LanguageList = useSelector(state => state.fetchLanguages?.data);
const getLanguageList = () => {

    dispatch(fetchLanguages());
}
/* eslint-disable react-hooks/exhaustive-deps */

useEffect(() => {
  getLanguageList();
}, []);

useEffect(() => {
  if (LanguageList) {
    setInitLangs(LanguageList.language);
  }
}, [LanguageList]);

useEffect(() => {
  setNewDetails({
    username: userDetails?.username,
    first_name: userDetails?.first_name,
    last_name: userDetails?.last_name,
    age: userDetails?.age,
    qualification:userDetails?.qualification,
    gender:userDetails?.gender,
    pin_code:userDetails?.pin_code,
    city:userDetails?.city,
    address:userDetails?.address,
    state:userDetails?.state,
    languages: userDetails?.languages,
    phone: userDetails?.phone,
    availability_status:userDetails?.availability_status,
    participation_type: userDetails?.participation_type
  });
  setEmail(userDetails?.email);
  setOriginalEmail(userDetails?.email);
}, [userDetails]);

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
            <Typography variant="h3" align="center" fontFamily="Rowdies">
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
              InputLabelProps={{ shrink: true,}}
              style={{zIndex: 0}}
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
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="Email"
              value={email}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
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
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="Gender"
              name="gender"
              value={newDetails?.gender === 'M' ? 'Male' :
              userDetails?.gender === 'F' ? 'Female' :
              userDetails?.gender === 'O' ? 'Other' : ''}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="City"
              name="city"
              value={newDetails?.city}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="Address"
              name="address"
              value={newDetails?.address}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="State"
              name="state"
              value={newDetails?.state}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="Pincode"
              name="pincode"
              value={newDetails?.pin_code}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="Age"
              name="age"
              value={newDetails?.age}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="Qualification"
              name="qualification"
              value={newDetails?.qualification}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="Role"
              value={UserMappedByRole(userDetails?.role)?.name}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
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
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="Organization"
              value={userDetails?.organization?.title}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            ></OutlinedTextField>
          </Grid>
          
          {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <InputLabel id="availability-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Availability Status</InputLabel>
            <Select
              fullWidth
              labelId="availability-label"
              name="availability_status"
              value={userDetails?.availability_status}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            >
              <MenuItem value="1">Available</MenuItem>
              <MenuItem value="2">Unavailable</MenuItem>
            </Select>
          </Grid> */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            {/* <InputLabel id="lang-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px", zIndex: 0, }}>Languages</InputLabel>
            <Select
              disabled
              multiple
              fullWidth
              labelId="lang-label"
              name="languages"
              value={newDetails?.languages? newDetails.languages : []}
              style={{zIndex: "0"}}
              MenuProps={MenuProps}
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
            </Select> */}
            <OutlinedTextField
              disabled
              fullWidth
              label = "Languages"
              labelId="lang-label"
              name="languages"
              value={newDetails?.languages? newDetails.languages : []}
              style={{zIndex: "0"}}
              InputLabelProps={{ shrink: true }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              
            ></OutlinedTextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <OutlinedTextField
              disabled
              fullWidth
              label="Availability Status"
              name="availability_status"
              value={newDetails?.availability_status}
              InputLabelProps={{ shrink: true }}
              style={{zIndex: 0}}
            ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            {/* <InputLabel id="lang-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px",}}>Participation Type</InputLabel>
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
            </Select> */}
            <OutlinedTextField
              disabled
              fullWidth
              label = "Participation Type"
              labelId="lang-label"
              name="participation_type"
              value={"Full_Time"}
              style={{zIndex: "0"}}
              input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
              
              
            ></OutlinedTextField>
            
          </Grid>
          <Grid 
              container 
              direction="row"
              justifyContent="flex-end"
              style={{marginTop: 20}}
          >
              {LoggedInUserId === userDetails?.id &&
                  <Grid item>
                      <CustomButton
                      label="Edit Profile"
                      onClick={() => navigate("/edit-profile")}
                      />
                  </Grid> }
          </Grid>
        </Grid>
      </Card>
    </Grid>
    <Snackbar 
      {...snackbarState} 
      handleClose={()=> setSnackbarState({...snackbarState, open: false})} 
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      hide={2000}
    />
  </ThemeProvider>
);
};

export default ProfileDetails;

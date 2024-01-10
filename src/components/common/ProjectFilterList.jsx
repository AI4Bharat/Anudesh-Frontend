import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  Popover,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Radio,
  Autocomplete,
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { translate } from "../../config/localisation";
import  "../../styles/Dataset.css";
import roles from "../../utils/Role";

const UserType = ["annotator", "reviewer","superchecker"];
const archivedProjects = ["true", "false"];
const ProjectFilterList = (props) => {
  
//   const dispatch = useDispatch();

  const {
    filterStatusData,
    currentFilters,
    updateFilters,
  
  } = props;

  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedArchivedProject, setSelectedArchivedProject] = useState("");


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
    "role": 2,
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
}


  return (
    <div>
      <Popover
        id={props.id}
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Grid container className="filterContainer">
          <Grid item xs={11} sm={11} md={11 } lg={11} xl={11} sx={{width:"130px"}} >
          <FormControl fullWidth size="small" >
            <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>Project Type</InputLabel>
            <Select
              labelId="project-type-label"
              id="project-type-select"
              value={selectedType}
              label="Project Type"
              onChange={(e) => setSelectedType(e.target.value)}
             
            >
              {projectTypes.map((type, index) => (
                <MenuItem key={index} value={type} >
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          

          </Grid>
       
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{mt:2}}>
            <Typography
              variant="body2"
              sx={{  mb: 1, fontWeight: "900",width:"120px" }}
            >
              Project User Type :
            </Typography>
            <FormGroup>
              {UserType.map((type,i) => {
                return (
                  <FormControlLabel
                    key={i}
                    control={
                      <Radio
                        checked={selectedUserType === type }
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => setSelectedUserType(e.target.value)}
                    value={type}
                    // label={snakeToTitleCase(type)}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                );
              })}
            </FormGroup>
          </Grid>
          {(roles?.WorkspaceManager === loggedInUserData?.role || roles?.OrganizationOwner === loggedInUserData?.role || roles?.Admin === loggedInUserData?.role )  &&
          <Grid item xs={5} sm={5} md={5} lg={5} xl={5} sx={{mt:2}}>
            <Typography
              variant="body2"
              sx={{ mr: 5, mb: 1, fontWeight: "900" }}
              className="filterTypo"
            >
              Archived Projects :
            </Typography>
          </Grid>}
        </Grid>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            columnGap: "10px",
            padding:"15px"
          }}
        >
          <Button
            // onClick={handleChangeCancelAll}
            variant="outlined"
            color="primary"
            size="small"
            className="clearAllBtn"
          >
            {" "}
            Clear All
          </Button>
          <Button
            // onClick={handleChange}
            variant="contained"
            color="primary"
            size="small"
            className="clearAllBtn"
          >
            {" "}
            Apply
          </Button>
        </Box>
      </Popover>
    </div>
  );
};
export default ProjectFilterList;

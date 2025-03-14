import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { translate } from "../../config/localisation";
import DatasetStyle from "../../styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import roles from "../../utils/Role";
import { snakeToTitleCase } from "@/utils/utils";
import { fetchProjectDomains } from "@/Lib/Features/getProjectDomains";

const UserType = ["annotator", "reviewer","superchecker"];
const archivedProjects = ["true", "false"];
const ProjectFilterList = (props) => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const {
    filterStatusData,
    currentFilters,
    updateFilters,
  
  } = props;


  

  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(currentFilters.project_type || "");
  const [selectedUserType, setSelectedUserType] = useState(currentFilters.project_user_type || "");
  const [selectedArchivedProject, setSelectedArchivedProject] = useState(currentFilters.archived_projects || "");
  
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const loggedInUserData = useSelector(
    (state) => state.getLoggedInData.data
  );
  useEffect(() => {
    dispatch(fetchProjectDomains());
  }, [dispatch]);
  useEffect(() => {
    let types = [];
    if (ProjectTypes) {
      Object.keys(ProjectTypes).forEach((key) => {
        if (ProjectTypes[key] && ProjectTypes[key]["project_types"]) {
          let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
          types.push(...subTypes);
        }
      });
    }
    setProjectTypes(types);
    
  }, [ProjectTypes]);

  const handleChange = (e) => {
    updateFilters({
      ...currentFilters,
      project_type: selectedType,
      project_user_type: selectedUserType,
      archived_projects: selectedArchivedProject,
    });
    props.handleClose();
  };

  const handleChangeCancelAll = () => {
    updateFilters({
        project_type: "",
        project_user_type: "",
        archived_projects: "",
     
    });
    setSelectedType("")
    setSelectedUserType("")
    setSelectedArchivedProject("")
    props.handleClose();
  };
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
        <Grid container className={classes.filterContainer}>
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
                        key={i}
                        checked={selectedUserType === type }
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => setSelectedUserType(e.target.value)}
                    value={type}
                    label={snakeToTitleCase(type)}
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
              className={classes.filterTypo}
            >
              Archived Projects :
            </Typography>
            <FormGroup>
              {archivedProjects.map((type, i) => {
                return (
                  <FormControlLabel
                    key={i}
                    control={
                      <Radio
                        checked={
                          selectedArchivedProject === type 
                        }
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => setSelectedArchivedProject(e.target.value)}
                    value={type}
                    label={snakeToTitleCase(type)}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                );
              })}
            </FormGroup>
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
            onClick={handleChangeCancelAll}
            variant="outlined"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            Clear All
          </Button>
          <Button
            onClick={handleChange}
            variant="contained"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
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
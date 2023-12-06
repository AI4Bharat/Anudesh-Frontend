'use client'
import  { React,useEffect, useState } from "react";
import { Radio, Box, Grid, Typography, ThemeProvider } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ProjectCardList from "../components/Project/ProjectCardList";
import ProjectCard from "../components/Project/ProjectCard";
import Spinner from "../components/common/Spinner";
// import GetProjectsAPI from "../../../../redux/actions/api/Dashboard/GetProjects";
// import APITransport from "../../../../redux/actions/apitransport/apitransport";
// import { useDispatch, useSelector } from "react-redux";
import Search from "../components/common/Search";
import DatasetStyle from "../../styles/Dataset";
import themeDefault from "../../themes/theme";
import tableTheme from "../../themes/tableTheme";

export default function ProjectList() {
  const [radiobutton, setRadiobutton] = useState(true);
  const classes = DatasetStyle();
//   const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setsSelectedFilters] = useState({
    project_type: "",
    project_user_type: "",
    archived_projects: "",
  });
//   const apiLoading = useSelector((state) => state.apiStatus.loading);
//   const projectData = useSelector((state) => state.getProjects.data);
  
//   const getDashboardprojectData = () => {
//     setLoading(true);
//     const projectObj = new GetProjectsAPI(selectedFilters);
//     dispatch(APITransport(projectObj));
//   };

//   useEffect(() => {
//     setLoading(false);
//   }, [projectData]);

//   useEffect(() => {
//     getDashboardprojectData();
//   }, [selectedFilters]);

  const handleProjectlist = () => {
    setRadiobutton(true);
  };
  const handleProjectcard = () => {
    setRadiobutton(false);
  };


const projectData = [{"id":1, "title":"workspace 1", "project_stage":"1", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":2, "title":"workspace 2", "project_stage":"2", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":3, "title":"workspace 3", "project_stage":"3", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":4, "title":"workspace 4", "project_stage":"1", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":5, "title":"workspace 5", "project_stage":"3", "tgt_language":"hindi", "project_type":"AudioTranscription"},
  {"id":6, "title":"workspace 6", "project_stage":"2", "tgt_language":"hindi", "project_type":"AudioTranscription"}]


  return (
    <ThemeProvider theme={themeDefault}>
      {/* {loading && <Spinner />} */}

      {/* <Grid container direction="row" columnSpacing={3} rowSpacing={2} sx={{ position: "static", bottom: "-51px", left: "20px" }} > */}
      <Grid container className={classes.root}>
        <Grid item style={{ flexGrow: "0" }}>
          <Typography variant="h6" sx={{ paddingBottom: "7px" }}>
            View :{" "}
          </Typography>
        </Grid>
        <Grid item style={{ flexGrow: "1", paddingLeft: "5px" }}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="ProjectList"
            >
              <FormControlLabel
                value="ProjectList"
                control={<Radio />}
                label="List"
                onClick={handleProjectlist}
              />
              <FormControlLabel
                value="ProjectCard"
                control={<Radio />}
                label="Card"
                onClick={handleProjectcard}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* <Grid  >
                    <FormControl >
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="ProjectList"
                            sx={{ marginLeft: "10px" }}
                        >

                            <FormControlLabel value="ProjectList" control={<Radio />} label="List view" onClick={handleProjectlist} />
                            <FormControlLabel value="ProjectCard" control={<Radio />} label="Card view" onClick={handleProjectcard} />

                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid> */}
        <Grid xs={3} item className={classes.fixedWidthContainer}>
          <Search />
        </Grid>
      </Grid>
      {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Search />
            </Grid> */}
      <Box>
        <Box sx={{ marginTop: "20px" }}>
          {radiobutton ? (
            <ProjectCardList
            //   projectData={projectData}
            //   selectedFilters={selectedFilters} 
            //   setsSelectedFilters={setsSelectedFilters} 
            />
          ) : (
            <ProjectCard 
            // projectData={projectData}
            //  selectedFilters={selectedFilters} 
            // setsSelectedFilters={setsSelectedFilters}
              />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

'use client'
import  { React,useEffect, useState } from "react";
import { Radio, Box, Grid, Typography, ThemeProvider } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ProjectCardList from "../../components/Project/ProjectCardList";
import ProjectCard from "../../components/Project/ProjectCard";
import Spinner from "../../components/common/Spinner";
import Search from "../../components/common/Search";
import  "../../styles/Dataset.css";
import themeDefault from "../../themes/theme";
import { useDispatch, useSelector } from "react-redux";
import tableTheme from "../../themes/tableTheme";
import { fetchProjects } from "@/Lib/Features/projects/getProjects";
export default function ProjectList() {
const dispatch = useDispatch();
const [radiobutton, setRadiobutton] = useState(true);

  const [loading, setLoading] = useState(false);
  const [selectedFilters, setsSelectedFilters] = useState({
    project_type: "",
    project_user_type: "",
    archived_projects: "",
  });
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const projectData = useSelector((state) => state.getProjects.data);
  
  const getDashboardprojectData = () => {
    setLoading(true);
    dispatch(fetchProjects(selectedFilters))
  };

  useEffect(() => {
    setLoading(false);
  }, [projectData]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchProjects(selectedFilters))
  }, [selectedFilters,dispatch]);

  const handleProjectlist = () => {
    setRadiobutton(true);
  };
  const handleProjectcard = () => {
    setRadiobutton(false);
  };
  return (
    <ThemeProvider theme={themeDefault}>
      {/* {loading && <Spinner />} */}

      {/* <Grid container direction="row" columnSpacing={3} rowSpacing={2} sx={{ position: "static", bottom: "-51px", left: "20px" }} > */}
      <Grid container className="root">
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

        <Grid xs={3} item className="fixedWidthContainer">
          <Search />
        </Grid>
      </Grid>

      <Box>
        <Box sx={{ marginTop: "20px" }}>
          {radiobutton ? (
            <ProjectCardList
              projectData={projectData}
              selectedFilters={selectedFilters} 
              setsSelectedFilters={setsSelectedFilters} 
            />
          ) : (
            <ProjectCard 
            projectData={projectData}
             selectedFilters={selectedFilters} 
            setsSelectedFilters={setsSelectedFilters}
              />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
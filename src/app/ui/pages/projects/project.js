'use client'
import  { React,useEffect, useState } from "react";
import { Radio, Box, Grid, Typography, ThemeProvider } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ProjectCardList from "@/components/Project/ProjectCardList";
import ProjectCard from "@/components/Project/ProjectCard";
import Spinner from "@/components/common/Spinner";
import Search from "@/components/common/Search";
import  "@/styles/Dataset.css";
import themeDefault from "@/themes/theme";
import { useDispatch, useSelector } from "react-redux";
import tableTheme from "@/themes/tableTheme";
import { fetchProjects } from "@/Lib/Features/projects/getProjects";
import { FetchLoggedInUserData } from "@/Lib/Features/getLoggedInData";

export default function ProjectList({data}) {
         /* eslint-disable react-hooks/exhaustive-deps */
           /* eslint-disable-next-line react/jsx-key */

           
const dispatch = useDispatch();
const [radiobutton, setRadiobutton] = useState(true);
console.log(data);
const theme = useTheme();


  // const [loading, setLoading] = useState(true);
  const [selectedFilters, setsSelectedFilters] = useState({
    project_type: "",
    project_user_type: "",
    archived_projects: "",
  });
  const [guestworkspace, setguestworkspace] = useState(false);
  const loggedInUserData = useSelector(state => state.getLoggedInData?.data);
  const apiLoading = useSelector((state) => state.getProjects.status === "loading");
  const projectData = useSelector((state) => state.getProjects.data);
  console.log(projectData);
  useEffect(() => {
       dispatch(FetchLoggedInUserData("me"));
  },[]);

   useEffect(() => {
      if (loggedInUserData ) {
      if (loggedInUserData?.guest_user==true) {
        console.log(loggedInUserData.guest_user);
        setguestworkspace(true);
      }
      dispatch(fetchProjects({ selectedFilters: selectedFilters, guestworkspace: guestworkspace }));
      
    }
  }, [selectedFilters,loggedInUserData]);

console.log(data?.length,"hel");


  const handleProjectlist = () => {
    setRadiobutton(true);
  };
  const handleProjectcard = () => {
    setRadiobutton(false);
  };
  const displayedProjects = data?.length > 0 ? data : projectData || [];
  return (
    <ThemeProvider theme={themeDefault}>
      {apiLoading ? <Spinner /> :  
      <>
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

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              className="fixedWidthContainer"
              sx={{
                paddingX: { xs: 2, sm: 3, md: 0 },
              }}
            >
              <Search />
            </Grid>
          </Grid>

      <Box>
        <Box sx={{ margin: "20px" }}>
          {radiobutton ? (
            <ProjectCardList
              projectData={displayedProjects}
              selectedFilters={selectedFilters} 
              setsSelectedFilters={setsSelectedFilters} 
            />
          ) : (
            <ProjectCard 
            projectData={displayedProjects}
             selectedFilters={selectedFilters} 
            setsSelectedFilters={setsSelectedFilters}
              />
          )}
        </Box>
      </Box>
      </>
      }
    </ThemeProvider>
  );
}

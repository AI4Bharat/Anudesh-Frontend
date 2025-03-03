"use client";
import { React, useEffect, useState } from "react";
import { Radio, Box, Grid, Typography, ThemeProvider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ProjectCardList from "@/components/Project/ProjectCardList";
import ProjectCard from "@/components/Project/ProjectCard";
import Spinner from "@/components/common/Spinner";
import Search from "@/components/common/Search";
import "@/styles/Dataset.css";
import themeDefault from "@/themes/theme";
import { useDispatch, useSelector } from "react-redux";
import tableTheme from "@/themes/tableTheme";
import { fetchProjects } from "@/Lib/Features/projects/getProjects";
import { FetchLoggedInUserData } from "@/Lib/Features/getLoggedInData";

export default function ProjectList({ data }) {
  /* eslint-disable react-hooks/exhaustive-deps */
  /* eslint-disable-next-line react/jsx-key */

  const dispatch = useDispatch();
  const [radiobutton, setRadiobutton] = useState(true);
  const theme = useTheme();

  // const [loading, setLoading] = useState(true);
  // Initialize selected filters from localStorage or set default values
  const [selectedFilters, setsSelectedFilters] = useState(() => {
    const savedFilters = localStorage.getItem("projectSelectedFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
        project_type: "",
        project_user_type: "",
        archived_projects: "",
      };
  });

  const [guestworkspace, setguestworkspace] = useState(false);
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
  const apiLoading = useSelector(
    (state) => state.getProjects.status === "loading",
  );
  const projectData = useSelector((state) => state.getProjects.data);
  useEffect(() => {
    dispatch(FetchLoggedInUserData("me"));
  }, []);

  useEffect(() => {
    if (loggedInUserData) {
      if (loggedInUserData?.guest_user == true) {
        setguestworkspace(true);
      }
      dispatch(
        fetchProjects({
          selectedFilters: selectedFilters,
          guestworkspace: guestworkspace,
        }),
      );
    }
  }, [selectedFilters, loggedInUserData]);

  // Save selected filters to localStorage
  useEffect(() => {
    localStorage.setItem(
      "projectSelectedFilters",
      JSON.stringify(selectedFilters),
    );
  }, [selectedFilters]);

  const handleProjectlist = () => {
    setRadiobutton(true);
  };
  const handleProjectcard = () => {
    setRadiobutton(false);
  };
  const displayedProjects = data?.length > 0 ? data : projectData || [];
  return (
    <ThemeProvider theme={themeDefault}>
      {apiLoading ? (
        <Spinner />
      ) : (
        <>
          <Grid container className="root">
            <Grid item style={{ flexGrow: "0" }}>
              <Typography
                variant="h6"
                sx={{ paddingBottom: "7px", paddingLeft: "15px" }}
              >
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

            <Grid item sx={{ mt: 1, mb: 1, mr: 2, ml: 2 }}>
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
      )}
    </ThemeProvider>
  );
}

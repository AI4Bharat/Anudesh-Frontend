"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import CreateProjectDropdown from "@/components/Project/createprojectbutton";
import { getUserProjects } from "@/Lib/Features/projects/bookmarkService";


const ProjectList = React.memo(function ProjectList({ data }) {
  /* eslint-disable react-hooks/exhaustive-deps */
  /* eslint-disable-next-line react/jsx-key */

  const dispatch = useDispatch();
  const [radiobutton, setRadiobutton] = useState(true);
    const [bookmarkedLoading, setBookmarkedLoading] = useState(false);
  
  // console.log(data);
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
  console.log(projectData);
  useEffect(() => {
    dispatch(FetchLoggedInUserData("me"));
  }, []);

  useEffect(() => {
    if (loggedInUserData) {
      const isGuest = loggedInUserData.guest_user === true;
      setguestworkspace(isGuest);
      dispatch(
        fetchProjects({
          selectedFilters: selectedFilters,
          guestworkspace: isGuest,
        }),
      );
    }
  }, [selectedFilters, loggedInUserData]);

    const [bookmarkedProjects, setBookmarkedProjects] = useState([]);

    const fetchBookmarkedProjects = async () => {
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
        fetchBookmarkedProjects();
    }, []);

    // Create a set of bookmarked project IDs for efficient lookup
    const bookmarkedProjectIds = useMemo(() => {
      return new Set(bookmarkedProjects.map(project => project.id));
    }, [bookmarkedProjects]);





  // Save selected filters to localStorage
  useEffect(() => {
    localStorage.setItem(
      "projectSelectedFilters",
      JSON.stringify(selectedFilters),
    );
  }, [selectedFilters]);

  // console.log(data?.length, "hel");

  const handleProjectlist = () => {
    setRadiobutton(true);
  };
  const handleProjectcard = () => {
    setRadiobutton(false);
  };


  
  const displayedProjects = useMemo(() => {
  if (!projectData || !Array.isArray(projectData)) return [];

  // If no bookmarked projects, return original array (no sorting needed)
  if (bookmarkedProjectIds.size === 0) {
    return projectData;
  }

  // Separate bookmarked and non-bookmarked projects in a single pass
  const bookmarked = [];
  const nonBookmarked = [];

  for (let i = 0; i < projectData.length; i++) {
    const project = projectData[i];
    if (bookmarkedProjectIds.has(project.id)) {
      bookmarked.push(project);
    } else {
      nonBookmarked.push(project);
    }
  }

  // Concatenate arrays
  return [...bookmarked, ...nonBookmarked];
}, [projectData, bookmarkedProjectIds]);



  return (
    <ThemeProvider theme={themeDefault}>
      {apiLoading || (projectData && projectData.length === 0) ? (
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

            <CreateProjectDropdown userRole={loggedInUserData?.role || loggedInUserData?.role_id} />
            {/* {workspaceData && (
              <ThemeProvider theme={tableTheme}>
                <MUIDataTable
                  key={`table-${displayWidth}`}
                  title={""}
                  data={data}
                  columns={columns}
                  options={{
                    ...options,
                    tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
                  }}
                />
              </ThemeProvider>
            )} */}
            <Grid item sx={{ mt: 0, mb: 2, mr: 2, ml: 2 }}>
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
})

export default ProjectList;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Radio, Box, Grid, Typography, ThemeProvider } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import DatasetCardList from "./DatasetCardList";
import DatasetCard from "./DatasetCard";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomButton from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";
import DatasetStyle from "@/styles/dataset";
import themeDefault from "@/themes/theme";
import Search from "@/components/common/Search";
import userRole from "@/utils/Role";
import { fetchDatasets } from "@/Lib/Features/datasets/GetDatasets";

export default function DatasetList() {
  /* eslint-disable react-hooks/exhaustive-deps */

  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const [radiobutton, setRadiobutton] = useState(true);
  // const [loading, setLoading] = useState(false);
  const datasetList = useSelector((state) => state.GetDatasets.data);
  const apiLoading = useSelector(
    (state) => state.GetDatasets.status == "loading",
  );

  // Initialize selected filters from localStorage or set default values
  const [selectedFilters, setsSelectedFilters] = useState(() => {
    const savedFilters = localStorage.getItem("datasetSelectedFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : { dataset_visibility: "", dataset_type: "" };
  });

  console.log(selectedFilters);

  // Fetch datasets based on selected filters
  const getDashboardprojectData = useCallback(() => {
    dispatch(fetchDatasets(selectedFilters));
  }, [dispatch, selectedFilters]);

  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);

  useEffect(() => {
    getDashboardprojectData();
  }, [getDashboardprojectData]);

  // Save selected filters to localStorage
  useEffect(() => {
    localStorage.setItem(
      "datasetSelectedFilters",
      JSON.stringify(selectedFilters),
    );
  }, [selectedFilters]);

  // Handle view change to list
  const handleProjectlist = useCallback(() => {
    setRadiobutton(true);
  }, []);

  // Handle view change to card
  const handleProjectcard = useCallback(() => {
    setRadiobutton(false);
  }, []);

  // Handle create project button click
  const handleCreateProject = useCallback(
    (e) => {
      navigate(`/create-Dataset-Instance-Button/`);
    },
    [navigate],
  );

  // Handle automate button click
  const handleAutomateButton = useCallback(
    (e) => {
      navigate("/datasets/automate");
    },
    [navigate],
  );

  // Memoize dataset list to avoid unnecessary re-renders
  const memoizedDatasetList = useMemo(() => datasetList, [datasetList]);

  return (
    <ThemeProvider theme={themeDefault}>
      {apiLoading ? (
        <Spinner />
      ) : (
        <>
          <Grid container className={classes.root}>
            <Grid item style={{ flexGrow: "0" }}>
              <Typography variant="h6" sx={{ paddingBottom: "8px" }}>
                View :{" "}
              </Typography>
            </Grid>
            <Grid item style={{ flexGrow: "1", paddingLeft: "5px" }}>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue="DatasetList"
                >
                  <FormControlLabel
                    value="DatasetList"
                    control={<Radio />}
                    label="List"
                    onClick={handleProjectlist}
                  />
                  <FormControlLabel
                    value="DatasetCard"
                    control={<Radio />}
                    label="Card"
                    onClick={handleProjectcard}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid xs={3} item className={classes.fixedWidthContainer}>
              <Search />
            </Grid>
          </Grid>

          <Box>
            <CustomButton
              sx={{
                p: 2,
                borderRadius: 3,
                mt: 2,
                mb: 2,
                justifyContent: "flex-end",
              }}
              onClick={handleCreateProject}
              label="Create New Dataset Instance"
            />
            <CustomButton
              sx={{
                p: 2,
                borderRadius: 3,
                mt: 2,
                mb: 2,
                ml: 2,
                justifyContent: "flex-end",
              }}
              disabled={
                userRole.Admin === loggedInUserData?.role ? false : true
              }
              onClick={handleAutomateButton}
              label="Automate Datasets"
            />
            <Box sx={{ p: 1 }}>
              {radiobutton ? (
                <DatasetCardList
                  datasetList={memoizedDatasetList}
                  selectedFilters={selectedFilters}
                  setsSelectedFilters={setsSelectedFilters}
                />
              ) : (
                <DatasetCard
                  datasetList={memoizedDatasetList}
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

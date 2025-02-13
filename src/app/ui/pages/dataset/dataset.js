import React, { useState, useEffect } from "react";
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
  const getDashboardprojectData = () => {
    dispatch(fetchDatasets(selectedFilters));
  };

  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);

  useEffect(() => {
    getDashboardprojectData();
  }, [selectedFilters]);

  // Save selected filters to localStorage
  useEffect(() => {
    localStorage.setItem(
      "datasetSelectedFilters",
      JSON.stringify(selectedFilters),
    );
  }, [selectedFilters]);

  const handleProjectlist = () => {
    setRadiobutton(true);
  };
  const handleProjectcard = () => {
    setRadiobutton(false);
  };
  const handleCreateProject = (e) => {
    navigate(`/create-Dataset-Instance-Button/`);
  };
  //   useEffect(()=>{
  //     getDatasetList();
  // },[]);

  //   const handleCreateProject =(e)=>{
  //       navigate(`/create-Dataset-Instance-Button/`)
  //   }

  const handleAutomateButton = (e) => {
    navigate("/datasets/automate");
  };

  return (
    <ThemeProvider theme={themeDefault}>
      {apiLoading ? (
        <Spinner />
      ) : (
        <>
          <Grid
            container
            className={classes.root}
            sx={{ alignItems: "center" }}
          >
            <Grid item sx={{ flexGrow: 0 }}>
              <Typography variant="h6" sx={{ paddingBottom: "8px" ,marginLeft: { xs: 3}}}>
                View :{" "}
              </Typography>
            </Grid>

            <Grid item sx={{ flexGrow: 1, paddingLeft: "5px" }}>
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

            <Grid
              item
              xs={12}
              sm={3}
              className={classes.fixedWidthContainer}
              sx={{ margin: { xs: 2, sm: 0 } }}
            >
              <Search />
            </Grid>
          </Grid>

          <Box>
            <CustomButton
              sx={{
                p: 2,
                borderRadius: 3,
               m:1,
                justifyContent: "flex-end",
              }}
              onClick={handleCreateProject}
              label="Create New Dataset Instance"
            />
            <CustomButton
              sx={{
                p: 2,
                borderRadius: 3,
               m:1,
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
                  datasetList={datasetList}
                  selectedFilters={selectedFilters}
                  setsSelectedFilters={setsSelectedFilters}
                />
              ) : (
                <DatasetCard
                  datasetList={datasetList}
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

import { Box, Card, Grid, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from "@/themes/theme";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomButton from "@/components/common/Button";
import { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";

const ReadonlyConfigurations = (props) => {
       /* eslint-disable react-hooks/exhaustive-deps */

  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const getWorkspaceDetails = () => {
    dispatch(fetchWorkspaceDetails(ProjectDetails.workspace_id));
}

useEffect(() => {
    getWorkspaceDetails();
}, []);

const workspaceDetails = useSelector(state => state.getWorkspaceDetails.data);

  return (
    <ThemeProvider theme={themeDefault}>
  <Grid
    container
    gap={2}
  >
    {ProjectDetails && ProjectDetails.sampling_mode && (
      <>
        {/* Sampling Parameters Section */}
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" }, // Adjust font size
              textAlign: { xs: "center", sm: "left" }, // Center-align on mobile
            }}
          >
            Sampling Parameters
          </Typography>
        </Grid>

        {/* Sampling Mode */}
        <Grid
          item
          xs={12}
          sx={{
            display:"flex",
            alignItems:"center"
          }}
          gap={2}
        >
          <Typography variant="subtitle1">Sampling Mode:</Typography>
          <Typography
            variant="subtitle1"
          >
            {ProjectDetails.sampling_mode === "f" && "Full"}
            {ProjectDetails.sampling_mode === "b" && "Batch"}
            {ProjectDetails.sampling_mode === "r" && "Random"}
          </Typography>
        </Grid>

        {/* Batch Size */}
        {ProjectDetails?.sampling_parameters_json?.batch_size && (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Batch Size:</Typography>
            <Typography
              variant="subtitle1"
              sx={{ ml: { xs: 0, md: 3 }, mt: { xs: 1, md: 0 } }}
            >
              {ProjectDetails.sampling_parameters_json.batch_size}
            </Typography>
          </Grid>
        )}

        {/* Dataset Instances */}
        {ProjectDetails.datasets.map((dataset, i) => (
          <Grid
            item
            xs={12}
            key={i}
            sx={{
              display: {md:"flex"},
              alignItems:"center"
            }}
            gap={2}
          >
            <Typography variant="subtitle1">Dataset Instance:</Typography>
            <Box sx={{
              display:"flex",
              alignItems:"center",
              gap:2,
              ml:{xs:4, md:0}
            }}>
            <Typography
              variant="subtitle1"
              >
              {dataset?.instance_name}
            </Typography>
            <Link
              to={`/datasets/${dataset?.instance_id}`}
              style={{ textDecoration: "none", marginTop: { xs: 8, md: 0 } }}
            >
              <CustomButton
                sx={{
                  borderRadius: 2,
                }}
                label="View Dataset"
                />
            </Link>
                </Box>
          </Grid>
        ))}

        {/* Workspace Name */}
        <Grid
          item
          xs={12}
          sx={{
            display: {md:"flex"},
            alignItems:"center"
          }}
          gap={2}
        >
          <Typography variant="subtitle1">Workspace Name:</Typography>
          <Box
          sx={{
              display:"flex",
              alignItems:"center",
              gap:2,
              ml:{xs:4, md:0}

            }}
          >
          <Typography
            variant="subtitle1"
          >
            {workspaceDetails.workspace_name}
          </Typography>
          <Link
            to={`/workspaces/${ProjectDetails.workspace_id}`}
            style={{ textDecoration: "none" }}
          >
            <CustomButton
              sx={{
                borderRadius: 2,
              }}
              label="View Workspace"
            />
          </Link>
          </Box>
        </Grid>

        {/* Filter String */}
        {ProjectDetails.filter_string && (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Filter String:</Typography>
            <Typography
              variant="subtitle1"
              sx={{ ml: { xs: 0, md: 3 }, mt: { xs: 1, md: 0 } }}
            >
              {ProjectDetails.filter_string}
            </Typography>
          </Grid>
        )}
      </>
    )}
  </Grid>

  {/* Variable Parameters Section */}
  <Grid container direction="row" sx={{ mt: 4 }}>
    {ProjectDetails?.variable_parameters?.output_language && (
      <div>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
          >
            Variable Parameters
          </Typography>
        </Grid>

        {/* Output Language */}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            mb: 2,
          }}
        >
          <Typography variant="subtitle1">Output Language:</Typography>
          <Typography
            variant="subtitle1"
            sx={{ ml: { xs: 0, md: 3 }, mt: { xs: 1, md: 0 } }}
          >
            {ProjectDetails?.variable_parameters?.output_language}
          </Typography>
        </Grid>
      </div>
    )}
  </Grid>
</ThemeProvider>

  );
};

export default ReadonlyConfigurations;

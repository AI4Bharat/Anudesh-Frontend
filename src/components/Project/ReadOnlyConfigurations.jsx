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
    spacing={2}
    sx={{ alignItems: 'flex-start' }}
  >
    {/* Left Column - Sampling Parameters Section */}
    {ProjectDetails && ProjectDetails.sampling_mode && (
      <Grid item xs={12} md={ProjectDetails?.project_type === "MultipleLLMInstructionDrivenChat" && ProjectDetails?.metadata_json ? 6 : 12}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            textAlign: { xs: "center", sm: "left" },
            mb: 2
          }}
        >
          Sampling Parameters
        </Typography>

          {/* Sampling Mode */}
          <Box
            sx={{
              display:"flex",
              alignItems:"center",
              mb: 1,
              gap: 2
            }}
          >
            <Typography variant="subtitle1">Sampling Mode:</Typography>
            <Typography
              variant="subtitle1"
            >
              {ProjectDetails.sampling_mode === "f" && "Full"}
              {ProjectDetails.sampling_mode === "b" && "Batch"}
              {ProjectDetails.sampling_mode === "r" && "Random"}
            </Typography>
          </Box>

          {/* Batch Size */}
          {ProjectDetails?.sampling_parameters_json?.batch_size && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                mb: 1,
                gap: 2
              }}
            >
              <Typography variant="subtitle1">Batch Size:</Typography>
              <Typography
                variant="subtitle1"
              >
                {ProjectDetails.sampling_parameters_json.batch_size}
              </Typography>
            </Box>
          )}

          {/* Dataset Instances */}
          {ProjectDetails.datasets.map((dataset, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                mb: 1,
                gap: 2
              }}
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
                  style={{ textDecoration: "none" }}
                >
                  <CustomButton
                    sx={{
                      borderRadius: 2,
                    }}
                    label="View Dataset"
                  />
                </Link>
              </Box>
            </Box>
          ))}

          {/* Workspace Name */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              mb: 1,
              gap: 2
            }}
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
          </Box>

          {/* Required Annotators per Task */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              gap: 2
            }}
          >
            <Typography variant="subtitle1">Required Annotators per Task:</Typography>
            <Typography
              variant="subtitle1"
            >
              {ProjectDetails.required_annotators_per_task}
            </Typography>
          </Box>
          
          {/* Filter String */}
          {ProjectDetails.filter_string && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                mb: 1,
                gap: 2
              }}
            >
              <Typography variant="subtitle1">Filter String:</Typography>
              <Typography
                variant="subtitle1"
              >
                {ProjectDetails.filter_string}
              </Typography>
            </Box>
          )}
      </Grid>
    )}

    {/* Right Column - Multi LLM Interaction Project Details */}
    {ProjectDetails?.project_type === "MultipleLLMInstructionDrivenChat" && ProjectDetails?.metadata_json && (
      <Grid item xs={12} md={6}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            textAlign: { xs: "center", sm: "left" },
            mb: 2,
          }}
        >
          Multi LLM Interaction Project Details
        </Typography>

        {/* No. of Models */}
        {ProjectDetails.metadata_json.num_models && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              gap: 2
            }}
          >
            <Typography variant="subtitle1">No. of Models:</Typography>
            <Typography
              variant="subtitle1"
            >
              {ProjectDetails.metadata_json.num_models}
            </Typography>
          </Box>
        )}

        {/* Models set */}
        {ProjectDetails.metadata_json.models_set && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              mb: 1,
              gap: 1
            }}
          >
            <Typography variant="subtitle1">Models set:</Typography>
            <Typography
              variant="subtitle1"
              sx={{ ml: { xs: 4, md: 0 }, mt: { xs: 1, md: 0 } }}
            >
              {Array.isArray(ProjectDetails.metadata_json.models_set) 
                ? ProjectDetails.metadata_json.models_set.join(", ")
                : ProjectDetails.metadata_json.models_set
              }
            </Typography>
          </Box>
        )}

        {/* Fixed Models */}
        {ProjectDetails.metadata_json.fixed_models && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              mb: 1,
              gap: 1
            }}
          >
            <Typography variant="subtitle1">Fixed Models:</Typography>
            <Typography
              variant="subtitle1"
              sx={{ ml: { xs: 4, md: 0 }, mt: { xs: 1, md: 0 } }}
            >
              {Array.isArray(ProjectDetails.metadata_json.fixed_models) 
                ? ProjectDetails.metadata_json.fixed_models.join(", ")
                : ProjectDetails.metadata_json.fixed_models
              }
            </Typography>
          </Box>
        )}
      </Grid>
    )}

    {/* Variable Parameters Section - Part of right column if Multi LLM exists, otherwise full width */}
    {ProjectDetails?.variable_parameters?.output_language && (
      <Grid item xs={12} md={ProjectDetails?.project_type === "MultipleLLMInstructionDrivenChat" ? 6 : 12}>
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: "1rem", md: "1.25rem" }, mb: 2 }}
        >
          Variable Parameters
        </Typography>

        {/* Output Language */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            mb: 1,
            gap: 2
          }}
        >
          <Typography variant="subtitle1">Output Language:</Typography>
          <Typography
            variant="subtitle1"
            sx={{ ml: { xs: 0, md: 3 }, mt: { xs: 1, md: 0 } }}
          >
            {ProjectDetails?.variable_parameters?.output_language}
          </Typography>
        </Box>
      </Grid>
    )}
  </Grid>
</ThemeProvider>

  );
};

export default ReadonlyConfigurations;

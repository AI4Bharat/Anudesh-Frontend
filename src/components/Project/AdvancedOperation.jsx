import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import themeDefault from "@/themes/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "@/components/common/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DownloadProjectButton from "./DownloadProjectButton";
import CustomizedSnackbars from "@/components/common/Snackbar";
import Spinner from "@/components/common/Spinner";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import DeleteProjectTasks from "./DeleteProjectTasks";
import { snakeToTitleCase } from "@/utils/utils";
import ExportProjectDialog from "./ExportProjectDialog";
import DeallocationAnnotatorsAndReviewers from "./DeallocationAnnotatorsAndReviewers";
import SuperCheckSettings from "./SuperCheckSettings";
import userRole from "@/utils/UserMappedByRole/Roles";
import TextField from "@mui/material/TextField";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";
import { fetchProjectTypeDetails } from "@/Lib/Features/projects/GetProjectTypeDetails";
import GetExportProjectButtonAPI from "@/app/actions/api/Projects/GetExportProjectButtonAPI";
import { fetchDownloadProjectAnnotations } from "@/Lib/Features/user/getDownloadProjectAnnotations";
import TaskReviewsAPI from "@/app/actions/api/Projects/TaskReviewsAPI";
import GetPublishProjectButtonAPI from "@/app/actions/api/Projects/GetPublishProjectButtonAPI";
import GetPullNewDataAPI from "@/app/actions/api/Projects/GetPullNewDataAPI";
import { fetchArchiveProject } from "@/Lib/Features/projects/GetArchiveProject";
import LoginAPI from "@/app/actions/api/user/Login";
import GetSaveButtonAPI from "@/app/actions/api/Projects/getSaveButtonAPI";
import TasksassignDialog from './taskassign';
import { fixed_Models, languageModelOptions } from "../../app/new-project/models";
import UpdateInactiveModelsDialog from "./UpdateInactiveModelsDialog";
/* eslint-disable react-hooks/exhaustive-deps */
const ProgressType = [
  "incomplete",
  "annotated",
  "reviewed",
  "super_checked",
  "exported",
];

const projectStage = [
  { name: "Annotation Stage", value: 1, disabled: false },
  { name: "Review Stage", value: 2, disabled: false },
  { name: "Super Check Stage", value: 3, disabled: false },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const AdvancedOperation = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateModelDialog, setOpenUpdateModelDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newDetails, setNewDetails] = useState();
  const [OpenExportProjectDialog, setOpenExportProjectDialog] = useState(false);
  const [datasetId, setDatasetId] = useState("");
  const [projectType, setProjectType] = useState("");
  const [taskReviews, setTaskReviews] = useState("");
  const { id } = useParams();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const apiMessage = useSelector((state) => state.apiStatus.message);
  const apiError = useSelector((state) => state.apiStatus.error);
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const ProjectTypes = useSelector(
    (state) => state.GetProjectTypeDetails?.data,
  );
  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);
  
  // States for models
  const [modelsSet, setModelsSet] = useState([]);
  const [fixedModels, setFixedModels] = useState([]);
  const [availableModels, setAvailableModels] = useState(languageModelOptions);

  const filteredProjectStage =
    ProjectDetails.required_annotators_per_task > 1
      ? projectStage.filter((stage) => stage.value !== 3)
      : projectStage;

  const isSuperChecker =
    userRole.WorkspaceManager === loggedInUserData?.role ||
    userRole.OrganizationOwner === loggedInUserData?.role ||
    userRole.Admin === loggedInUserData?.role
      ? ProjectDetails?.project_stage == 3
      : false ||
        ProjectDetails?.review_supercheckers?.some(
          (superchecker) => superchecker.id === loggedInUserData?.id,
        );

  const [taskStatus, setTaskStatus] = useState(
    isSuperChecker
      ? ["incomplete", "annotated", "reviewed", "super_checked", "exported"]
      : ["incomplete", "annotated", "reviewed", "super_checked", "exported"],
  );

  let ProgressTypeValue = "super_checked";
  const filterdata = ProgressType.filter((item) => item !== ProgressTypeValue);
  const FilterProgressType = isSuperChecker ? ProgressType : filterdata;

  const getProjectDetails = () => {
    dispatch(fetchProjectDetails(id));
  };
  useEffect(() => {
    setProjectType(ProjectTypes?.input_dataset?.class);
  }, [ProjectTypes]);

  useEffect(() => {
    getProjectDetails();
  }, []);

  // Initialize models from ProjectDetails
  useEffect(() => {
    if (ProjectDetails?.metadata_json) {
      console.log("Loading models:", ProjectDetails.metadata_json);
      
      let modelsSetFromProject = ProjectDetails.metadata_json.models_set || [];
      let fixedModelsFromProject = ProjectDetails.metadata_json.fixed_models || [];
      
      // Ensure all models exist in availableModels
      const allModels = [...languageModelOptions];
      modelsSetFromProject.forEach(model => {
        if (!allModels.includes(model)) {
          allModels.push(model);
        }
      });
      fixedModelsFromProject.forEach(model => {
        if (!allModels.includes(model)) {
          allModels.push(model);
        }
      });
      
      setAvailableModels(allModels);
      setModelsSet(modelsSetFromProject);
      setFixedModels(fixedModelsFromProject);
    }
  }, [ProjectDetails]);

  useEffect(() => {
    setNewDetails({
      title: ProjectDetails.title,
      description: ProjectDetails.description,
    });
    setTaskReviews(ProjectDetails.project_stage);
  }, [ProjectDetails]);

  useEffect(() => {
    dispatch(fetchProjectTypeDetails(ProjectDetails?.project_type));
  }, []);

  const getExportProjectButton = async () => {
    setOpenExportProjectDialog(false);
    console.log(id, ProjectTypes);
    const projectObj =
      ProjectTypes?.output_dataset?.save_type === "new_record"
        ? new GetExportProjectButtonAPI(
            id,
            ProjectDetails?.datasets[0].instance_id,
            datasetId,
            ProjectTypes?.output_dataset?.save_type,
          )
        : new GetExportProjectButtonAPI(id);
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const getDownloadProjectAnnotations = async () => {
    // 'https://backend.shoonya.ai4bharat.org/projects/606/export_project_tasks/'
    // SetTask([])
    // setLoading(true)
    dispatch(fetchDownloadProjectAnnotations(id, taskStatus));
    // const projectObj = new GetPublishProjectButtonAPI(id);
    // const res = await fetch(projectObj.apiEndPoint(), {
    //   method: "POST",
    //   body: JSON.stringify(projectObj.getBody()),
    //   headers: projectObj.getHeaders().headers,
    // });
    // const resp = await res.json();
    // setLoading(false);
    // if (res.ok) {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "success",
    //   });
    // } else {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "error",
    //   });
    // }
  };

  const handleReviewToggle = async (e) => {
    let ProjectStageValue = e.target.value;
    setTaskReviews(e.target.value);

    if (ProjectStageValue === 1) {
      const disableSuperchecker = [...projectStage].map((opt) => {
        if (opt.value === 3) opt.disabled = true;
        else opt.disabled = false;
        return opt;
      });

      setTaskReviews(disableSuperchecker);
    } else if (ProjectStageValue === 2) {
      const disableSuperchecker = [...projectStage].map((opt) => {
        if (opt.value === 3) opt.disabled = false;
        else opt.disabled = false;
        return opt;
      });

      setTaskReviews(disableSuperchecker);
    } else if (ProjectStageValue === 3) {
      const disableSuperchecker = [...projectStage].map((opt) => {
        if (opt.value === 1) opt.disabled = true;
        else opt.disabled = false;
        return opt;
      });

      setTaskReviews(disableSuperchecker);
    }

    setLoading(true);
    const reviewObj = new TaskReviewsAPI(id, e.target.value);
    const res = await fetch(reviewObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(reviewObj.getBody()),
      headers: reviewObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      dispatch(fetchProjectDetails(id));
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const handleDownoadMetadataToggle = async () => {
    // setLoading(true);
    setDownloadMetadataToggle(
      (downloadMetadataToggle) => !downloadMetadataToggle,
    );
  };
  const handleMetadata = async () => {
    const sendData={
      title: newDetails.title,
      project_type: ProjectDetails.project_type,
      metadata_json:{
        blank_response:!blankResponse
      }
    }
      const projectObj = new GetSaveButtonAPI(id, sendData);
            const res = await fetch(projectObj.apiEndPoint(), {
                method: "PUT",
                body: JSON.stringify(projectObj.getBody()),
                headers: projectObj.getHeaders().headers,
            });
            const resp = await res.json();
            setLoading(false);
            if (res.ok) {
                setSnackbarInfo({
                    open: true,
                    message: "success",
                    variant: "success",
                })
                setBlankResponse(
                  (blankResponse) => !blankResponse,
                );    
            } else {
                setSnackbarInfo({
                    open: true,
                    message: resp?.message,
                    variant: "error",
                })
            }
  };

  // Function to save models configuration and update tasks
  const handleSaveModels = async () => {
    if (modelsSet.length === 0) {
      setSnackbarInfo({
        open: true,
        message: "Please select at least one model before saving.",
        variant: "error",
      });
      return;
    }
    
    setLoading(true);
    const updatedMetadataJson = {
      ...ProjectDetails.metadata_json,
      models_set: modelsSet,
      fixed_models: fixedModels,
      num_models: modelsSet.length
    };
    
    const sendData = {
      title: ProjectDetails.title,
      description: ProjectDetails.description,
      project_type: ProjectDetails.project_type,
      metadata_json: updatedMetadataJson
    };
    
    const projectObj = new GetSaveButtonAPI(id, sendData);
    try {
      // First, save the project metadata
      const res = await fetch(projectObj.apiEndPoint(), {
        method: "PUT",
        body: JSON.stringify(projectObj.getBody()),
        headers: projectObj.getHeaders().headers,
      });
      const resp = await res.json();
      
      if (res.ok) {
        // Ask user if they want to update existing tasks
        const updateTasks = window.confirm(
          "Models configuration saved successfully!\n\nDo you want to update all existing tasks to use the new models?\n\nNote: This will affect all tasks in this project."
        );
        
        if (updateTasks) {
          // Call the backend endpoint to update all tasks
          const updateTasksRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${id}/update_tasks_models/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${localStorage.getItem('anudesh_access_token')}`
              }
            }
          );
          
          const updateTasksData = await updateTasksRes.json();
          
          if (updateTasksRes.ok) {
            setSnackbarInfo({
              open: true,
              message: `✅ Models saved and ${updateTasksData.updated_count} out of ${updateTasksData.total_tasks} tasks updated successfully!`,
              variant: "success",
            });
            
            // Show errors if any
            if (updateTasksData.errors && updateTasksData.errors.length > 0) {
              console.warn("Task update errors:", updateTasksData.errors);
            }
          } else {
            setSnackbarInfo({
              open: true,
              message: `⚠️ Models saved but tasks update failed: ${updateTasksData.message || "Unknown error"}`,
              variant: "warning",
            });
          }
        } else {
          setSnackbarInfo({
            open: true,
            message: "Models configuration saved successfully!",
            variant: "success",
          });
        }
        
        // Refresh project details to get updated data
        dispatch(fetchProjectDetails(id));
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message || "Failed to save models configuration",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error saving models:", error);
      setSnackbarInfo({
        open: true,
        message: "Network error. Failed to save configuration.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPublishProjectButton = async () => {
    const projectObj = new GetPublishProjectButtonAPI(id);
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const getPullNewDataAPI = async () => {
    const projectObj = new GetPullNewDataAPI(id);
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const ArchiveProject = useSelector((state) => state.GetArchiveProject?.data);
  const [isArchived, setIsArchived] = useState(false);
  const [downloadMetadataToggle, setDownloadMetadataToggle] = useState(true);
  const [blankResponse, setBlankResponse] = useState(ProjectDetails?.metadata_json?.blank_response||false);

  const getArchiveProjectAPI = () => {
    dispatch(fetchArchiveProject(id));
  };

  useEffect(() => {
    setIsArchived(ProjectDetails?.is_archived);
  }, [ProjectDetails]);

  const handleDownloadProjectAnnotations = () => {
    getDownloadProjectAnnotations();
  };
  const handleExportProject = () => {
    getExportProjectButton();
  };
  const handlePublishProject = () => {
    getPublishProjectButton();
  };

  const handlePullNewData = () => {
    getPullNewDataAPI();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenExportProjectDialog(false);
  };

  const handleok = () => {
    getArchiveProjectAPI();
    getProjectDetails();
    setIsArchived(!isArchived);
    setOpen(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setTaskStatus(value);
  };

  const handleOpenExportProjectDialog = () => {
    setOpenExportProjectDialog(true);
  };

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  const emailId = localStorage.getItem("email_id");
  const [password, setPassword] = useState("");
  const handleConfirm = async () => {
    const apiObj = new LoginAPI(emailId, password);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const rsp_data = await res.json();
    if (res.ok) {
      handleok();
    } else {
      setSnackbarInfo({
        open: true,
        message: "Invalid credentials, please try again",
        variant: "error",
      });
    }
  };
  const navigate = useNavigate();

  const handleDeleteProject = () => {
    setOpenDeleteDialog(true);
  };

  const confirmDeleteProject = async () => {
    setOpenDeleteDialog(false);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${id}/`, {
        method: "DELETE",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`JWT ${localStorage.getItem('anudesh_access_token')}`
        },
      });
      setLoading(false);

      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message: "Project deleted",
          variant: "success",
        });
        setTimeout(() => {
          navigate("/projects");
        }, 1000);
      } else {
        const data = await res.json();
        setSnackbarInfo({
          open: true,
          message: data.detail || data.error || "Delete failed",
          variant: "error",
        });
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      setSnackbarInfo({
        open: true,
        message: "An error occurred while deleting the project",
        variant: "error",
      });
    }
  };
  
  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      <Grid>{renderSnackBar()}</Grid>

      <div className={classes.rootdiv}>
        <Grid
          container
          columns={16}
          spacing={{xs:2,lg:4}}
          sx={{
            alignItems:"flex-start",
            justifyContent:"space-between"
          }}
        >
        <Grid
          container
          item
          xs={12}
          sm={4}
          sx={{
            gap:4,
          }}
        >
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Tooltip title="Make this project visible and available to assigned annotators">
              <span style={{ display: "block", width: "100%" }}>
                <CustomButton
                  sx={{
                    inlineSize: "max-content",
                    borderRadius: 3,
                    width: "100%"
                  }}
                  onClick={handlePublishProject}
                  label="Publish Project"
                />
              </span>
            </Tooltip>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Tooltip title={isArchived ? "This project is already archived" : "Archive this project to hide it from active projects"}
            >
              <span>
                <CustomButton
                  sx={{
                    inlineSize: "max-content",
                    borderRadius: 3,
                    width: "100%"
                  }}
                  color="error"
                  onClick={handleClickOpen}
                  label={isArchived ? "Archived" : "Archive"}
                  disabled={
                    userRole.WorkspaceManager === loggedInUserData?.role
                      ? true
                      : false
                  }
                />
              </span>
            </Tooltip>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            {userRole.WorkspaceManager === loggedInUserData?.role ? null : (
              <FormControl 
              className={classes.formControl}
              sx={{
                width: "100%"
              }}
              >
                <InputLabel
                  id="Select-Task-Statuses"
                  sx={{ fontSize: "16px" }}
                >
                  Select Task Statuses
                </InputLabel>
                <Select
                  labelId="Select-Task-Statuses"
                  label="Select Task Statuses"
                  multiple
                  value={taskStatus}
                  onChange={handleChange}
                  renderValue={(taskStatus) => taskStatus.join(", ")}
                  MenuProps={MenuProps}
                >
                  {FilterProgressType.map((option) => (
                    <MenuItem
                      sx={{ textTransform: "capitalize" }}
                      key={option}
                      value={option}
                    >
                      <ListItemIcon>
                        <Checkbox checked={taskStatus.indexOf(option) > -1} />
                      </ListItemIcon>
                      <ListItemText primary={snakeToTitleCase(option)} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs={12}
          sm={4}
          sx={{
            gap:4,
          }}
        >
          {ProjectDetails.project_type == "ContextualTranslationEditing" ? (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Tooltip title="Download annotation data for this project type">
                <CustomButton
                  sx={{
                    inlineSize: "max-content",
                    borderRadius: 3,
                    width: "100%"
                  }}
                  onClick={handleDownloadProjectAnnotations}
                  label="Downoload Project Annotations"
                />
              </Tooltip>
            </Grid>
          ) : (
            " "
          )}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {ProjectTypes?.output_dataset?.save_type === "new_record" ? (
              <Tooltip title="Export all project tasks into a new dataset record">
                <span>
                  <CustomButton
                    sx={{
                      inlineSize: "max-content",
                      borderRadius: 3,
                      width: "100%",
                      height: "50px",
                    }}
                    onClick={handleOpenExportProjectDialog}
                    label="Export Project into Dataset"
                    disabled={
                      userRole.WorkspaceManager === loggedInUserData?.role
                        ? true
                        : false
                    }
                  />
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Export all project tasks into the existing dataset">
                <span>
                  <CustomButton
                    sx={{
                      inlineSize: "max-content",
                      borderRadius: 3,
                      width: "100%",
                      height: "50px",

                    }}
                    onClick={handleExportProject}
                    label="Export Project into Dataset"
                    disabled={
                      userRole.WorkspaceManager === loggedInUserData?.role
                        ? true
                        : false
                    }
                  />
                </span>
              </Tooltip>
            )}
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {ProjectDetails.sampling_mode == "f" ||
            ProjectDetails.sampling_mode == "b" ? (
              <Tooltip title="Pull new data items from the source dataset into this project">
                <span>
                  <CustomButton
                    sx={{
                      inlineSize: "max-content",
                      borderRadius: 3,
                      width: "100%",
                      height: "50px",
                    }}
                    onClick={handlePullNewData}
                    label="Pull New Data Items from Source Dataset"
                    disabled={
                      userRole.WorkspaceManager === loggedInUserData?.role
                        ? true
                        : false
                    }
                  />
                </span>
              </Tooltip>
            ) : (
              " "
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <DownloadProjectButton
              taskStatus={taskStatus}
              SetTask={setTaskStatus}
              downloadMetadataToggle={downloadMetadataToggle}
            />
          </Grid>
          
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <DeleteProjectTasks />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <DeallocationAnnotatorsAndReviewers />
          </Grid>
          {ProjectDetails?.project_type === "InstructionDrivenChat" && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Tooltip title="Update incomplete tasks with inactive models to a new active model">
                <span>
                  <CustomButton
                    sx={{
                      inlineSize: "max-content",
                      borderRadius: 3,
                      width: "100%",
                      height: "50px",
                    }}
                    onClick={() => setOpenUpdateModelDialog(true)}
                    label="Update Inactive Models"
                  />
                </span>
              </Tooltip>
            </Grid>
          )}
        </Grid>

        <Grid
          container
          item
          xs={12}
          sm={4}
          sx={{ 
            gap:4,
           }}
        >
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormControl 
            className={classes.formControl}
            sx={{
                width: "100%"
              }}
            >
              <InputLabel id="task-Reviews-label" sx={{ fontSize: "16px" }}>
                Project Stage
              </InputLabel>
              <Select
                labelId="task-Reviews-label"
                id="task-Reviews-select"
                value={taskReviews}
                label="Task Reviews"
                onChange={handleReviewToggle}
              >
                {filteredProjectStage.map((type, index) => (
                  <MenuItem
                    value={type.value}
                    key={index}
                    disabled={type.disabled}
                  >
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TasksassignDialog />
          </Grid>

          {(userRole.WorkspaceManager === loggedInUserData?.role ||
          userRole.OrganizationOwner === loggedInUserData?.role ||
          userRole.Admin === loggedInUserData?.role
            ? ProjectDetails?.project_stage == 3
            : false ||
              ProjectDetails?.review_supercheckers?.some(
                (superchecker) => superchecker.id === loggedInUserData?.id,
              )) && (
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <SuperCheckSettings ProjectDetails={ProjectDetails} />
            </Grid>
          )}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Download Metadata"
              labelPlacement="start"
              checked={downloadMetadataToggle}
              onChange={handleDownoadMetadataToggle}
              disabled={
                userRole.WorkspaceManager === loggedInUserData?.role
                  ? true
                  : false
              }
            />
          </Grid>
          {ProjectDetails?.project_type === "InstructionDrivenChat" && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControlLabel
                control={<Switch color="primary" />}
                label="Blank Response"
                labelPlacement="start"
                checked={blankResponse}
                onChange={handleMetadata}
                disabled={
                  userRole.WorkspaceManager === loggedInUserData?.role
                    ? true
                    : false
                }
              />
            </Grid>
          )}
        
          {userRole.Admin === loggedInUserData?.role && ProjectDetails?.labeled_task_count === 0 &&  (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Tooltip title="Permanently delete this project and all its tasks. This action cannot be undone.">
                <span>
                  <CustomButton
                    sx={{
                      inlineSize: "max-content",
                      borderRadius: 3,
                      width: "100%",
                    }}
                    color="error"
                    onClick={handleDeleteProject}
                    label="Delete Project"
                  />
                </span>
              </Tooltip>
            </Grid>
          )}
        </Grid>

        {/* Model Configuration Section — full-width row, centered, equal layout */}
        {ProjectDetails?.project_type === "MultipleLLMInstructionDrivenChat" && (
          <Grid item xs={16} sm={16} md={16} lg={16} xl={16} sx={{ pt: "8px !important" }}>
            <Box
              sx={{
                borderTop: "1px solid #e0e0e0",
                pt: 1,
                mt: 0,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  mb: 1.5,
                  fontWeight: 600,
                }}
              >
                Model Configuration
              </Typography>

              <Grid container spacing={{ xs: 2, lg: 4 }}>
                {/* Models Set */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "text.primary",
                    }}
                  >
                    Models Set
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      color: "text.secondary",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Select the models that will be available for this project.{" "}
                    <strong>Uncheck models to remove them.</strong>
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel
                      id="models-set-label"
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        backgroundColor: "background.paper",
                        px: 0.5,
                      }}
                    >
                      Select Models
                    </InputLabel>
                    <Select
                      labelId="models-set-label"
                      label="Select Models"
                      multiple
                      value={modelsSet}
                      onChange={(e) => {
                        const newModelsSet = e.target.value;
                        setModelsSet(newModelsSet);
                        setFixedModels((prev) =>
                          prev.filter((model) => newModelsSet.includes(model))
                        );
                      }}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {selected.map((value) => (
                            <Box
                              key={value}
                              sx={{
                                backgroundColor: "action.selected",
                                borderRadius: "4px",
                                padding: "2px 8px",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                lineHeight: 1.5,
                              }}
                            >
                              {value}
                            </Box>
                          ))}
                        </Box>
                      )}
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300, width: "auto", minWidth: 200 },
                        },
                      }}
                      sx={{
                        "& .MuiSelect-select": {
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          py: 1.5,
                          minHeight: "auto",
                        },
                      }}
                    >
                      {availableModels.map((model) => (
                        <MenuItem
                          key={model}
                          value={model}
                          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, py: 1 }}
                        >
                          <Checkbox
                            checked={modelsSet.indexOf(model) > -1}
                            size="small"
                            sx={{ p: 0.5, mr: 1 }}
                          />
                          <ListItemText
                            primary={model}
                            primaryTypographyProps={{
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                    {modelsSet.length === 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "warning.main",
                          mt: 1,
                          display: "block",
                          fontSize: "0.75rem",
                        }}
                      >
                        ⚠️ Please select at least one model
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Fixed Models */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "text.primary",
                    }}
                  >
                    Fixed Models
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      color: "text.secondary",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Select models that will always be included (subset of Models Set)
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel
                      id="fixed-models-label"
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        backgroundColor: "background.paper",
                        px: 0.5,
                      }}
                    >
                      Select Fixed Models
                    </InputLabel>
                    <Select
                      labelId="fixed-models-label"
                      label="Select Fixed Models"
                      multiple
                      value={fixedModels}
                      onChange={(e) => setFixedModels(e.target.value)}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {selected.map((value) => (
                            <Box
                              key={value}
                              sx={{
                                backgroundColor: "primary.light",
                                color: "primary.contrastText",
                                borderRadius: "4px",
                                padding: "2px 8px",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                lineHeight: 1.5,
                              }}
                            >
                              {value}
                            </Box>
                          ))}
                        </Box>
                      )}
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300, width: "auto", minWidth: 200 },
                        },
                      }}
                      disabled={modelsSet.length === 0}
                      sx={{
                        "& .MuiSelect-select": {
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          py: 1.5,
                          minHeight: "auto",
                        },
                      }}
                    >
                      {modelsSet.map((model) => (
                        <MenuItem
                          key={model}
                          value={model}
                          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, py: 1 }}
                        >
                          <Checkbox
                            checked={fixedModels.indexOf(model) > -1}
                            size="small"
                            sx={{ p: 0.5, mr: 1 }}
                          />
                          <ListItemText
                            primary={model}
                            primaryTypographyProps={{
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Summary + Save */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "text.primary",
                    }}
                  >
                    Current Configuration
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "action.hover",
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      Total Models: <strong>{modelsSet.length}</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        mt: 0.5,
                      }}
                    >
                      Fixed Models: <strong>{fixedModels.length}</strong>
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.disabled",
                        fontSize: "0.7rem",
                        fontStyle: "italic",
                        display: "block",
                        mt: 1,
                      }}
                    >
                      {fixedModels.length === modelsSet.length && modelsSet.length > 0
                        ? "📌 All models are fixed"
                        : fixedModels.length > 0
                        ? "📍 Some models are fixed"
                        : modelsSet.length > 0
                        ? "✨ No fixed models selected"
                        : "⚙️ Configure models above"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <CustomButton
                      onClick={handleSaveModels}
                      label="Save Model Configuration"
                      sx={{
                        borderRadius: 2,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: { xs: "6px 16px", sm: "8px 24px" },
                        minWidth: { xs: "auto", sm: "200px" },
                      }}
                      disabled={loading || modelsSet.length === 0}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}
        </Grid>
        
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to {!isArchived ? "archive" : "unarchive"}{" "}
              this project?
            </DialogContentText>
            <TextField
              autoFocus
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              color="error"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Delete this project permanently?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDeleteProject} variant="contained" color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <UpdateInactiveModelsDialog
          open={openUpdateModelDialog}
          handleClose={() => setOpenUpdateModelDialog(false)}
          projectId={id}
          setSnackbarInfo={setSnackbarInfo}
        />
        {OpenExportProjectDialog && (
          <ExportProjectDialog
            OpenExportProjectDialog={OpenExportProjectDialog}
            datavalue={getExportProjectButton}
            datasetId={datasetId}
            setDatasetId={setDatasetId}
            projectType={projectType}
            handleClose={handleClose}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default AdvancedOperation;

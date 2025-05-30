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
import AllocateTasksDialog from "./manualtaskassign";
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


  const getPublishProjectButton = async () => {
    const projectObj = new GetPublishProjectButtonAPI(id);
    //dispatch(APITransport(projectObj));
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

  // useEffect(() => {
  //     setSnackbarInfo({
  //         open: apiMessage ? true : false,
  //         variant: apiError ? "error" : "success",
  //         message: apiMessage,
  //     });
  //     setSpinner(false);
  // }, [apiMessage, apiError])

  const getPullNewDataAPI = async () => {
    const projectObj = new GetPullNewDataAPI(id);
    //dispatch(APITransport(projectObj));
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
      window.alert("Invalid credentials, please try again");
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
          // direction="row"
          xs={12}
          sm={4}
          sx={{
            gap:4,
          }}
        >
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomButton
              sx={{
                inlineSize: "max-content",
                borderRadius: 3,
                width: "100%"
              }}
              onClick={handlePublishProject}
              label="Publish Project"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
          // direction="row"
          xs={12}
          sm={4}
          sx={{
            gap:4,
          }}
        >
          {ProjectDetails.project_type == "ContextualTranslationEditing" ? (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CustomButton
                sx={{
                  inlineSize: "max-content",
                  borderRadius: 3,
                  width: "100%"
                }}
                onClick={handleDownloadProjectAnnotations}
                label="Downoload Project Annotations"
              />
            </Grid>
          ) : (
            " "
          )}
          {/* <div className={classes.divider} ></div> */}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {ProjectTypes?.output_dataset?.save_type === "new_record" ? (
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
            ) : (
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
            )}
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {ProjectDetails.sampling_mode == "f" ||
            ProjectDetails.sampling_mode == "b" ? (
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
            <AllocateTasksDialog />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <DeleteProjectTasks />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <DeallocationAnnotatorsAndReviewers />
          </Grid>
        </Grid>

        <Grid
          container
          item
          // direction="row"
          xs={12}
          sm={4}
          sx={{ 
            gap:4,
           }}
        >
          {/* <div className={classes.divider} ></div> */}
          {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControlLabel
                control={<Switch color="primary" />}
                label="Task Reviews"
                labelPlacement="start"
                checked={ProjectDetails.enable_task_reviews}
                onChange={handleReviewToggle}
              />
            </Grid> */}
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
                // getOptionDisabled={(option) => option.disabled}
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

          {/* <div className={classes.divider} ></div> */}
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
        </Grid>
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

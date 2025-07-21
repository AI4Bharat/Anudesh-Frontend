"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import themeDefault from "../../../../themes/theme";
import DatasetStyle from "../../../../styles/dataset";
import AddWorkspaceDialog from "./AddWorkspaceDialog";
import componentType from "../../../../config/PageType";
import ProjectTable from "./ProjectTable";
import AnnotatorsTable from "../../../../components/Tabs/AnnotatorTable";
import ManagersTable from "../../../../components/Tabs/ManagersTable";
import Workspaces from "../../../../components/common/Workspace";
import { translate } from "../../../../config/localisation";
import Members from "../../../../components/Tabs/Members";
import Invites from "../../../../components/Tabs/Invites";
import OrganizationSettings from "../../../../components/Tabs/organizationSettings";
import OrganizationReports from "../../../../components/Tabs/organizationReports";
import WorkspaceReports from "../../../../components/common/WorkspaceReports";
import Spinner from "../../../../components/common/Spinner";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddUsersDialog from "../../../../components/common/AddUsersDialog";
import addUserTypes from "../../../../Constants/addUserTypes";
import GetWorkspacesDetailsAPI from "../../../actions/api/workspace/getWorkspaceDetails";
import userRole from "@/utils/Role";
import InviteUsersDialog from "@/components/Project/InviteUsersDialog";
import UserRolesList from "@/utils/UserMappedByRole/UserRolesList";
import getOrganizationUsers from "@/Lib/Features/getOrganizationUsers";
import InviteUsersToOrgAPI from "@/app/actions/api/user/InviteUsersToOrgAPI";
import { fetchWorkspaceData } from "@/Lib/Features/GetWorkspace";
import TaskAnalytics from "../progress/Workspace/TaskAnalytics";
import MetaAnalytics from "../progress/Workspace/MetaAnalytics";
import ProgressList from "../progress/Workspace/ProgressAnalytics";
import PerformanceAnalytics from "../progress/Workspace/PerformanceAnalytics";
import AssignMembersDialog from "./bulkassignmembers";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const DetailsViewPage = (props) => {
  const navigate = useNavigate();
  const CustomButton = ({
    label,
    buttonVariant,
    color,
    disabled = false,
    ...rest
  }) => (
    <Button
      {...rest}
      variant={buttonVariant ? buttonVariant : "contained"}
      color={color ? color : "primary"}
      disabled={disabled}
    >
      {label}
    </Button>
  );
  const { pageType, title, createdBy, onArchiveWorkspace, initialUserData } =
    props;
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userType, setUserType] = useState(Object.keys(UserRolesList)[0]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [btn, setbtn] = useState(null);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const { id, orgId } = useParams();
  const organisation_id = useSelector(
    (state) => state.getWorkspacesProjectData?.data?.[0]?.organization_id,
  );
  const handleUserDialogOpen = () => {
    setAddUserDialogOpen(true);
  };
  const handleUserDialogClose = () => {
    setAddUserDialogOpen(false);
  };
  const classes = DatasetStyle();
  const userDetails = useSelector((state) => state.getLoggedInData.data);
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);

  const [user, setuser] = useState(initialUserData);
  const [loading, setLoading] = useState(false);
  const apiLoading = useSelector(
    (state) =>
      pageType === componentType.Type_Workspace &&
      state.getWorkspaceDetails.status == "loading",
  );
  const [addAnnotatorsDialogOpen, setAddAnnotatorsDialogOpen] =
    React.useState(false);
  const [annotatorDialogOpen, setAnnotatorDialogOpen] = useState(false);
    React.useState(false);
  const [addManagersDialogOpen, setAddManagersDialogOpen] =
    React.useState(false);
  const [addWorkspacesDialogOpen, setAddWorkspacesDialogOpen] =
    React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectmenu, setSelectmenu] = useState("TaskAnalytics");
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getWorkspaceDetails = () => {
    dispatch(fetchWorkspaceDetails(orgId));
  };

  const handleAnnotatorDialogClose = () => {
    setAddAnnotatorsDialogOpen(false);
  };

  const handleAnnotatorDialogOpen = () => {
    setAddAnnotatorsDialogOpen(true);
  };

  const handleManagerDialogClose = () => {
    setAddManagersDialogOpen(false);
  };

  const handleManagerDialogOpen = () => {
    setAddManagersDialogOpen(true);
  };

  const handleWorkspaceDialogClose = () => {
    setAddWorkspacesDialogOpen(false);
    dispatch(fetchWorkspaceData());
  };

  const handleWorkspaceDialogOpen = () => {
    setAddWorkspacesDialogOpen(true);
  };

  const handleOpenSettings = () => {
    navigate(`/workspaces/${id}/workspacesetting`);
  };

  const handleClickMenu = (data) => {
    setSelectmenu(data);
    handleMenuClose();
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  const addBtnClickHandler = async () => {
    setLoading(true);
    if (userDetails?.role === userRole.WorkspaceManager) {
      const addUsesrsObj = new InviteManagerSuggestions(
        organisation_id,
        selectedUsers,
        userType,
      );
      const res = await fetch(addUsesrsObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addUsesrsObj.getBody()),
        headers: addUsesrsObj.getHeaders().headers,
      });
      const resp = await res.json();
      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
        const orgObj = new GetOragnizationUsersAPI(id);
        dispatch(APITransport(orgObj));
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    } else {
      const addMembersObj = new InviteUsersToOrgAPI(
        organisation_id,
        selectedUsers,
        userType,
      );
      const res = await fetch(addMembersObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addMembersObj.getBody()),
        headers: addMembersObj.getHeaders().headers,
      });
      const resp = await res.json();
      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
        const orgObj = new GetOragnizationUsersAPI(id);
        dispatch(APITransport(orgObj));
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    }
    handleUserDialogClose();
    setLoading(false);
    setSelectedUsers([]);
    setSelectedEmails([]);
    setCsvFile(null);
    setbtn(null);
    setUserType(Object.keys(UserRolesList)[0]);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <ThemeProvider theme={themeDefault}>
      {apiLoading ? (
        <Spinner />
      ) : (
        <Grid container direction="row" sx={{ maxWidth: "100%" }}>
          <Card
            className={classes.workspaceCard}
            sx={{ width: "100%", padding: 2 }}
          >
            {pageType === componentType.Type_Organization && (
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                {title}
              </Typography>
            )}
            {pageType === componentType.Type_Workspace && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
              >
                <Box flex="1" textAlign="center">
                  <Typography variant="h3">{title}</Typography>
                </Box>

                {(userRole.Annotator !== userDetails?.role ||
                  userRole.Reviewer !== userDetails?.role ||
                  userRole.SuperChecker !== userDetails?.role) && (
                  <Tooltip
                    title={
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "0.7rem",
                        }}
                      >
                        {translate("label.showProjectSettings")}
                      </Typography>
                    }
                  >
                    <IconButton onClick={handleOpenSettings}>
                      <SettingsOutlinedIcon
                        sx={{ color: "grey.600" }}
                        fontSize="large"
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
            <Typography
              variant="body1"
              gutterBottom
              component="div"
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: "1rem",
              }}
            >
              Created by : {createdBy}
            </Typography>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="fullWidth"
                TabIndicatorProps={{
                  style: { display: "none" },
                }}
                orientation={isSmallScreen ? "vertical" : "horizontal"}
              >
                {pageType === componentType.Type_Workspace && (
                  <Tab
                    label={translate("label.projects")}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 0 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 0 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}
                {pageType === componentType.Type_Organization && (
                  <Tab
                    label={translate("label.workspaces")}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 0 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 0 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}

                {pageType === componentType.Type_Workspace && (
                  <Tab
                    label={translate("label.members")}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 1 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 1 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}
                {pageType === componentType.Type_Organization && (
                  <Tab
                    label={translate("label.members")}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 1 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 1 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}

                {pageType === componentType.Type_Workspace && (
                  <Tab
                    label={translate("label.managers")}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 2 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 2 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}
                {pageType === componentType.Type_Organization && (
                  <Tab
                    label={translate("label.invites")}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 2 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 2 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}

                {pageType === componentType.Type_Workspace && (
                  <Tab
                    label={translate("label.reports")}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 3 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 3 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}
                {pageType === componentType.Type_Organization && (
                  <Tab
                    label={translate("label.reports")}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 3 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 3 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}

                {pageType === componentType.Type_Workspace && (
                  <Tab
                    label={
                      <div style={{ display: "flex", marginTop: "5px" }}>
                        {" "}
                        {translate("label.analytics")}{" "}
                        <KeyboardArrowDownIcon
                          style={{ paddingBottom: "1px" }}
                        />{" "}
                      </div>
                    }
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 4 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 4 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}

                {pageType === componentType.Type_Organization && (
                  <Tab
                    label={"Organization " + translate("label.settings")}
                    sx={{
                      fontSize: 16,
                      fontWeight: "700",
                      bgcolor: value === 4 ? "#d3d3d3" : "#F5F5F5",
                      color: value === 4 ? "black" : "text.primary",
                      margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                )}
              </Tabs>
            </Box>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                selected={selectmenu === "TaskAnalytics"}
                onClick={() => handleClickMenu("TaskAnalytics")}
              >
                {" "}
                Task Analytics{" "}
              </MenuItem>
              <MenuItem
                selected={selectmenu === "MetaAnalytics"}
                onClick={() => handleClickMenu("MetaAnalytics")}
              >
                Meta Analytics
              </MenuItem>
              <MenuItem
                selected={selectmenu === "AdvanceAnalytics"}
                onClick={() => handleClickMenu("AdvanceAnalytics")}
              >
                Advance Analytics
              </MenuItem>
              <MenuItem
                selected={selectmenu === "PerformanceAnalytics"}
                onClick={() => handleClickMenu("PerformanceAnalytics")}
              >
                Performance Analytics
              </MenuItem>
            </Menu>
            <TabPanel
              value={value}
              index={0}
              style={{ maxWidth: "100%", width: "100%" }}
            >
              {pageType === componentType.Type_Workspace && (
                <>
                  <Link to={`/new-project/${id}`}>
                    <CustomButton
                      sx={{ width: "100%", mb: 2 }}
                      className={classes.projectButton}
                      label={"Add New Project"}
                    />
                  </Link>

                  <div className={classes.workspaceTables}>
                    <ProjectTable />
                  </div>
                </>
              )}
              {pageType === componentType.Type_Organization && (
                <>
                  <CustomButton
                    label={translate("button.addNewWorkspace")}
                    sx={{ width: "100%", mb: 2 }}
                    onClick={handleWorkspaceDialogOpen}
                  />
                  <Workspaces />
                  <AddWorkspaceDialog
                    dialogCloseHandler={handleWorkspaceDialogClose}
                    isOpen={addWorkspacesDialogOpen}
                    orgId={orgId}
                  />
                </>
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {pageType === componentType.Type_Workspace && (
                <>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    columnSpacing={4}
                    rowSpacing={2}
                  >
                    <Grid item xs={6}>
                      <CustomButton
                        className={classes.annotatorsButton}
                        label={"Add Members to Workspace"}
                        sx={{ width: "100%", mb: 2 }}
                        onClick={handleAnnotatorDialogOpen}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <AssignMembersDialog
                        open={annotatorDialogOpen}
                        onClose={() => setAnnotatorDialogOpen(false)}
                        sx={{ width: '100%', mb: 2}}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <CustomButton
                        className={classes.annotatorsButton}
                        label={"Invite Users to Organisation"}
                        sx={{ width: "100%", mb: 2 }}
                        onClick={handleUserDialogOpen}
                      />
                    </Grid> */}
                  </Grid>
                  <AnnotatorsTable
                    onRemoveSuccessGetUpdatedMembers={() =>
                      getWorkspaceDetails()
                    }
                  />
                  <AddUsersDialog
                    handleDialogClose={handleAnnotatorDialogClose}
                    isOpen={addAnnotatorsDialogOpen}
                    userType={addUserTypes.ANNOTATOR}
                    id={id}
                  />
                  <InviteUsersDialog
                    handleDialogClose={handleUserDialogClose}
                    isOpen={addUserDialogOpen}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    userType={userType}
                    setUserType={setUserType}
                    addBtnClickHandler={() => addBtnClickHandler()}
                    loading={loading}
                    selectedEmails={selectedEmails}
                    setSelectedEmails={setSelectedEmails}
                    csvFile={csvFile}
                    setCsvFile={setCsvFile}
                    btn={btn}
                    setbtn={setbtn}
                    value={value}
                    setvalue={setValue}
                  />
                </>
              )}
              {pageType === componentType.Type_Organization && (
                <>
                  <Members />
                </>
              )}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {pageType === componentType.Type_Workspace && (
                <>
                  <CustomButton
                    label={"Assign Managers"}
                    sx={{ width: "100%", mb: 2 }}
                    onClick={handleManagerDialogOpen}
                  />
                  <ManagersTable />
                  <AddUsersDialog
                    handleDialogClose={handleManagerDialogClose}
                    isOpen={addManagersDialogOpen}
                    userType={addUserTypes.MANAGER}
                    id={id}
                  />
                </>
              )}
              {pageType === componentType.Type_Organization && (
                <Invites hideButton={true} reSendButton={true} />
              )}
            </TabPanel>
            <TabPanel value={value} index={3}>
              {pageType === componentType.Type_Organization && (
                <OrganizationReports />
              )}
              {pageType === componentType.Type_Workspace && (
                <WorkspaceReports />
              )}
            </TabPanel>
            <TabPanel value={value} index={4}>
              {pageType === componentType.Type_Workspace &&
                selectmenu === "TaskAnalytics" && <TaskAnalytics />}
              {pageType === componentType.Type_Workspace &&
                selectmenu === "MetaAnalytics" && <MetaAnalytics />}
              {pageType === componentType.Type_Workspace &&
                selectmenu === "AdvanceAnalytics" && <ProgressList />}
              {pageType === componentType.Type_Workspace &&
                selectmenu === "PerformanceAnalytics" && (
                  <PerformanceAnalytics />
                )}
              {pageType === componentType.Type_Organization && (
                <OrganizationSettings />
              )}
            </TabPanel>
          </Card>
        </Grid>
      )}
    </ThemeProvider>
  );
};

export default DetailsViewPage;

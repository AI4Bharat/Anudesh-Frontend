"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";

import React, { useEffect, useState } from "react";
import themeDefault from "../../../../themes/theme";
import { Link, useNavigate, useParams, useHistory } from "react-router-dom";
import TaskTable from "../../../../components/Project/TaskTable";
import MembersTable from "../../../../components/Project/MembersTable";
import ReportsTable from "../../../../components/Project/ReportsTable";
import { translate } from "../../../../config/localisation";
import addUserTypes from "../../../../Constants/addUserTypes";
import Spinner from "../../../../components/common/Spinner";
import Menu from "@mui/material/Menu";
import { styled, alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import SuperCheckerTasks from "@/components/Project/SuperCheckerTasks";
import DatasetStyle from "../../../../styles/dataset";
import ProjectDescription from "../../../../components/Tabs/ProjectDescription";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import userRole from "../../../../utils/UsersRolesList";
import BackButton from "../../../../components/common/BackButton";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";
import AllTaskTable from "@/components/Project/AllTaskTable";
import { setSelectedTab } from "@/Lib/Features/projects/ProjectTabs";
import BookmarkButton from "@/components/Project/BookmarkButton";

const menuOptions = [
  { name: "Tasks", isChecked: false, component: () => null },
  { name: "Members", isChecked: false, component: () => null },
  { name: "Reports", isChecked: true, component: () => null },
];

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
        <Box sx={{ p: 0, overflowX: "auto" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

//(Row 1)
const MetaBadge = ({ label, value, chipSx }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Typography sx={{ fontSize: "0.65rem", fontWeight: "bold", color: "text.secondary", letterSpacing: "1px" }}>
      {label}
    </Typography>
    <Chip
      label={value}
      size="small"
      sx={{ fontWeight: "bold", borderRadius: "4px", height: "20px", fontSize: "0.75rem", ...chipSx }}
    />
  </Box>
);

// Used in the expanded details section (Row 2)
const DetailItem = ({ label, value, chipSx }) => (
  <Box>
    <Typography sx={{ fontSize: "0.7rem", fontWeight: "bold", color: "text.secondary", mb: 0.5, textTransform: "uppercase" }}>
      {label}
    </Typography>
    <Chip label={value} size="small" sx={{ borderRadius: "16px", ...chipSx }} />
  </Box>
);

const Projects = () => {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(false);
  const [projectData, setProjectData] = useState([
    { name: "Project ID", value: null },
    { name: "Description", value: null },
    { name: "Project Type", value: null },
    { name: "Status", value: null },
    { name: "Unassigned Task", value: null },
    { name: "Total Labeled Task", value: null },
    { name: "Reviewed Task Count", value: null },
  ]);
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  /* eslint-disable react-hooks/exhaustive-deps */

  const dispatch = useDispatch();
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const userDetails = useSelector((state) => state.getLoggedInData?.data);
  const loggedInUserData = useSelector((state) => state.getLoggedInData?.data);
  const selectedTab = useSelector((state) => state.getProjectTabs.selectedTab);
  const getProjectDetails = () => {
    dispatch(fetchProjectDetails(id));
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetails(id));
    }
  }, [id, dispatch]);
  useEffect(() => {
    if (ProjectDetails && ProjectDetails.id) {
      const projectStatus = ProjectDetails.is_archived
        ? "Archived"
        : ProjectDetails.is_published
          ? "Published"
          : "Draft";
      setProjectData([
        {
          name: "Project ID",
          value: ProjectDetails.id,
        },
        {
          name: "Description",
          value: ProjectDetails.description,
        },
        {
          name: "Project Type",
          value: ProjectDetails.project_type,
        },
        {
          name: "Status",
          value: projectStatus,
        },
        {
          name: "Unassigned Annotation Tasks",
          value: ProjectDetails.unassigned_task_count,
        },
        {
          name: "Unassigned Review Tasks",
          value: ProjectDetails.labeled_task_count,
        },

        {
          name: "Unassigned Super Check Tasks",
          value: ProjectDetails.reviewed_task_count,
        },
      ]);
    }
  }, [ProjectDetails.id]);
  const [annotationreviewertype, setAnnotationreviewertype] = useState();
  const [value, setValue] = useState(selectedTab); // Initialize state with the value from Redux
  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch(setSelectedTab(newValue)); // Dispatch the action to update the selected tab in Redux
  };
  const apiLoading = useSelector(
    (state) => state.getProjectDetails.status !== "succeeded",
  );
  const isAnnotators =
    userRole.WorkspaceManager === loggedInUserData?.role ||
    userRole.OrganizationOwner === loggedInUserData?.role ||
    userRole.Admin === loggedInUserData?.role ||
    ProjectDetails?.project_stage === 1 ||
    ProjectDetails?.annotators?.some((user) => user.id === userDetails?.id);

  const isReviewer =
    userRole.WorkspaceManager === loggedInUserData?.role ||
      userRole.OrganizationOwner === loggedInUserData?.role ||
      userRole.Admin === loggedInUserData?.role
      ? ProjectDetails?.project_stage == 2 || ProjectDetails?.project_stage == 3
      : ProjectDetails?.annotation_reviewers?.some(
        (reviewer) => reviewer.id === userDetails?.id,
      );
  const isSuperChecker =
    userRole.WorkspaceManager === loggedInUserData?.role ||
      userRole.OrganizationOwner === loggedInUserData?.role ||
      userRole.Admin === loggedInUserData?.role
      ? ProjectDetails?.project_stage == 3
      : false ||
      ProjectDetails?.review_supercheckers?.some(
        (superchecker) => superchecker.id === userDetails?.id,
      );

  const allTask =
    userRole.WorkspaceManager === loggedInUserData?.role ||
    userRole.OrganizationOwner === loggedInUserData?.role ||
    userRole.Admin === loggedInUserData?.role;

  /* eslint-disable react-hooks/exhaustive-deps */

  let annotationdata = ProjectDetails?.annotators?.filter(
    (x) => x.id == userDetails.id,
  );
  let reviewerdata = ProjectDetails?.annotation_reviewers?.filter(
    (x) => x.id == userDetails.id,
  );
  useEffect(() => {
    if (annotationdata?.length && !reviewerdata?.length) {
      setAnnotationreviewertype("Annotation Reports");
    } else if (reviewerdata?.length && !annotationdata?.length) {
      setAnnotationreviewertype("Reviewer Reports");
    }
  }, [annotationdata, reviewerdata, dispatch]);

  const handleOpenSettings = () => {
    navigate(`/projects/${id}/projectsetting`);
  };

  let projectValue = "Unassigned Super Check Tasks";
  const filterdata = projectData.filter((item) => item.name !== projectValue);
  const projectFilterData = isSuperChecker ? projectData : filterdata;

  const TabPanData = [
    {
      label: translate("label.annotationTasks"),
      tabPanelEle: (
        <TaskTable type="annotation" ProjectDetails={ProjectDetails} />
      ),
      showTab: isAnnotators,
    },
    {
      label: translate("label.reviewTasks"),
      tabPanelEle: <TaskTable type="review" />,
      showTab: isReviewer,
    },
    {
      label: "Super Check Tasks",
      tabPanelEle: <SuperCheckerTasks type="superChecker" />,
      showTab: isSuperChecker,
    },

    {
      label: translate("label.annotators"),
      tabPanelEle: (
        <MembersTable
          onRemoveSuccessGetUpdatedMembers={() => getProjectDetails()}
          dataSource={ProjectDetails.annotators}
          type={addUserTypes.PROJECT_ANNOTATORS}
        />
      ),
      showTab: isAnnotators,
    },
    {
      label: translate("label.reviewers"),
      tabPanelEle: (
        <MembersTable
          onRemoveSuccessGetUpdatedMembers={() => getProjectDetails()}
          dataSource={ProjectDetails.annotation_reviewers}
          type={addUserTypes.PROJECT_REVIEWER}
        />
      ),
      showTab: isReviewer,
    },
    {
      label: "Super Checkers ",
      tabPanelEle: (
        <MembersTable
          dataSource={ProjectDetails.review_supercheckers}
          type={addUserTypes.PROJECT_SUPERCHECKER}
          onRemoveSuccessGetUpdatedMembers={() => getProjectDetails()}
        />
      ),
      showTab: isSuperChecker,
    },

    {
      label: translate("label.reports"),
      tabPanelEle: (
        <ReportsTable
          annotationreviewertype={annotationreviewertype}
          userDetails={userDetails}
          isAnnotators={isAnnotators}
          isReviewer={isReviewer}
          isSuperChecker={isSuperChecker}
        />
      ),
      showTab: isAnnotators || isReviewer || isSuperChecker,
    },

    {
      label: "All Tasks",
      tabPanelEle: <AllTaskTable />,
      showTab: allTask,
    },
  ];

  const filteredTabPanData = TabPanData.filter((el, i) => el.showTab);

  const renderTabs = () => {
    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="project details tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{
              style: {
                backgroundColor: "#F05A22",
              }
            }}
            sx={{
              minHeight: "40px",
              height: "40px",
              "& .MuiTabs-flexContainer": {
                px: 0,
                py: 0,
              }
            }}
          >
            {filteredTabPanData.map((el, i) => {
              return (
                <Tab
                  key={i}
                  label={el.label}
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: value === i ? "#e65100 !important" : "text.secondary",
                    textTransform: "none",
                    minHeight: "40px",
                    padding: "4px 8px",
                    minWidth: "auto",
                    marginRight: { xs: "8px", sm: "16px" },
                    borderRadius: "6px",
                    "& .MuiTouchRipple-root": {
                      color: "#e65100"
                    }
                  }}
                />
              );
            })}
          </Tabs>
        </Box>
        {filteredTabPanData.map((el, i) => {
          return (
            <TabPanel value={value} index={i} key={i}>
              {el.tabPanelEle}
            </TabPanel>
          );
        })}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={themeDefault}>
      {apiLoading ? (
        <Spinner />
      ) : (
        <Box
          sx={{
            padding: { xs: 1.5, sm: 2, md: 3 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1, sm: 1.5 },
            width: "100%",
            maxWidth: "1440px",
            margin: "0 auto",
          }}
        >
          {/* Top Action Row */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <BackButton
              startIcon={<ArrowBackIcon fontSize="small" />}
              label="Back To Previous Page"
              sx={{
                bgcolor: "#F05A22",
                color: "white",
                textTransform: "none",
                fontWeight: "600",
                fontSize: "0.875rem",
                padding: "4px 12px",
                borderRadius: "4px",
                boxShadow: "none",
                "&:hover": { bgcolor: "#D94F1A", boxShadow: "none" },
              }}
            />
          </Box>

          {/* Hero Card */}
          <Card sx={{ width: "100%", border: "1px solid #e0e0e0", boxShadow: "none", borderRadius: 2 }}>
            {/* Row 1 */}
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: { xs: 1.5, sm: 2 }
                }}>
              {/* Left */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#191c1e" }}>
                  {ProjectDetails.title}
                </Typography>
                {id && (
                  <BookmarkButton
                    projectId={id}
                    onBookmarkChange={(projectId, isBookmarked) => {
                      console.log("Bookmark changed:", projectId, isBookmarked);
                    }}
                  />
                )}
                {(userRole.WorkspaceManager === loggedInUserData?.role ||
                  userRole.OrganizationOwner === loggedInUserData?.role ||
                  userRole.Admin === loggedInUserData?.role) && (
                    <Tooltip title={translate("label.showProjectSettings")}>
                      <IconButton onClick={handleOpenSettings} size="small" sx={{ color: "text.secondary" }}>
                        <SettingsOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
              </Box>
              {/* Right */}
              <Box sx={{ display: "flex", alignItems: "center", columnGap: { xs: 2, sm: 3 }, rowGap: { xs: 1, sm: 1.5 }, flexWrap: "wrap" }}>
              <MetaBadge label="PROJECT ID:" value={ProjectDetails.id} chipSx={{ bgcolor: "#E6F4EA", color: "#1E8E3E" }} />
              <MetaBadge label="TYPE:" value={ProjectDetails.project_type} chipSx={{ bgcolor: "#F3E8FD", color: "#7627BB" }} />
              {ProjectDetails.unassigned_task_count !== undefined && (
                <MetaBadge label="TASKS:" value={`${ProjectDetails.unassigned_task_count} Unassigned`} chipSx={{ bgcolor: "#FEF7E0", color: "#B06000" }} />
              )}
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  endIcon={showDetails ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                  sx={{
                    textTransform: "none",
                    color: "#F05A22",
                    fontWeight: "600",
                    fontSize: "0.75rem",
                    px: 0.5,
                    minWidth: "auto",
                    alignSelf: "center",
                    display: "inline-flex",
                    alignItems: "center",
                    "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                  }}
                >
                  {showDetails ? "Less Details" : "More Details"}
                </Button>
              </Box>
            </Box>

            {/* Row 2 */}
            <Collapse in={showDetails}>
              <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: "#f8fafc", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: { xs: 2, sm: 3 } }}>
                <DetailItem label="Description" value={ProjectDetails.description || "N/A"} chipSx={{ bgcolor: "#CFFAFE", color: "#0E7490" }} />
                <DetailItem label="Status" value={ProjectDetails.is_archived ? "Archived" : ProjectDetails.is_published ? "Published" : "Draft"} chipSx={{ bgcolor: "#E8F0FE", color: "#1967D2" }} />
                <DetailItem label="Unassigned Tasks" value={ProjectDetails.unassigned_task_count || "0"} chipSx={{ bgcolor: "#FEF7E0", color: "#B06000" }} />
                <DetailItem label="Unassigned Review Tasks" value={ProjectDetails.labeled_task_count} chipSx={{ bgcolor: "#E6F4EA", color: "#1E8E3E" }} />
                {isSuperChecker && (
                  <DetailItem label="Unassigned Super Check Tasks" value={ProjectDetails.reviewed_task_count} chipSx={{ bgcolor: "#FCE8E6", color: "#C5221F" }} />
                )}
              </Box>
            </Collapse>
          </Card>

          {/* Tabs and Data Section */}
          <Card sx={{ width: "100%", border: "1px solid #e0e0e0", boxShadow: "none", borderRadius: 2 }}>
            {renderTabs()}
          </Card>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default Projects;

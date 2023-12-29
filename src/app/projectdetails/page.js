'use client'
import {
    Box,
    Button,
    Card,
    Grid,
    Tab,
    Tabs,
    ThemeProvider,
    Typography,
    IconButton,
    Tooltip,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import themeDefault from "../../themes/theme";
  import Link from "next/link";
  import TaskTable from "../components/Project/TaskTable";
  import MembersTable from "../components/Project/MembersTable";
  import ReportsTable from "../components/Project/ReportsTable";
  import { translate } from "../../config/localisation";
  import addUserTypes from "../Constants/addUserTypes";
  import Spinner from "../components/common/Spinner";
  import Menu from "@mui/material/Menu";
  import { styled, alpha } from "@mui/material/styles";
  import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
  import DatasetStyle from "../../styles/Dataset";
  import ProjectDescription from "../components/Tabs/ProjectDescription";
  import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
  import userRole from "../../utils/UsersRolesList";
  import SuperChecker from "../components/Project/SuperChecker";
  import { useRouter } from "next/navigation";
  

  

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
  
debugger
  export default function ProjectDetails () {

    const classes = DatasetStyle();
    const [projectData, setProjectData] = useState([
      { name: "Project ID", value: null },
      { name: "Description", value: null },
      { name: "Project Type", value: null },
      { name: "Status", value: null },
      { name: "Unassigned Task", value: null },
      { name: "Total Labeled Task", value: null },
      { name: "Reviewed Task Count", value: null },
    ]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    
    const userDetails= {
      "id": 1,
      "username": "shoonya",
      "email": "shoonya@ai4bharat.org",
      "languages": [],
      "availability_status": 1,
      "enable_mail": false,
      "first_name": "Admin",
      "last_name": "AI4B",
      "phone": "",
      "profile_photo": "",
      "role": 6,
      "organization": {
          "id": 1,
          "title": "AI4Bharat",
          "email_domain_name": "ai4bharat.org",
          "created_by": {
              "username": "shoonya",
              "email": "shoonya@ai4bharat.org",
              "first_name": "Admin",
              "last_name": "AI4B",
              "role": 6
          },
          "created_at": "2022-04-24T13:11:30.339610Z"
      },
      "unverified_email": "shoonya@ai4bharat.org",
      "date_joined": "2022-04-24T07:40:11Z",
      "participation_type": 3,
      "prefer_cl_ui": false,
      "is_active": true
  };
   
     const loggedInUserData= {
      "id": 1,
      "username": "shoonya",
      "email": "shoonya@ai4bharat.org",
      "languages": [],
      "availability_status": 1,
      "enable_mail": false,
      "first_name": "Admin",
      "last_name": "AI4B",
      "phone": "",
      "profile_photo": "",
      "role": 2,
      "organization": {
          "id": 1,
          "title": "AI4Bharat",
          "email_domain_name": "ai4bharat.org",
          "created_by": {
              "username": "shoonya",
              "email": "shoonya@ai4bharat.org",
              "first_name": "Admin",
              "last_name": "AI4B",
              "role": 6
          },
          "created_at": "2022-04-24T13:11:30.339610Z"
      },
      "unverified_email": "shoonya@ai4bharat.org",
      "date_joined": "2022-04-24T07:40:11Z",
      "participation_type": 3,
      "prefer_cl_ui": false,
      "is_active": true
  }
    const ProjectDetails = {
      "id": 2279,
      "title": "test ocr ce 2",
      "description": "test",
      "created_by": null,
      "is_archived": false,
      "is_published": true,
      "annotators": [
          {
              "id": 1,
              "username": "shoonya",
              "email": "shoonya@ai4bharat.org",
              "languages": [],
              "availability_status": 1,
              "enable_mail": false,
              "first_name": "Admin",
              "last_name": "AI4B",
              "phone": "",
              "profile_photo": "",
              "role": 6,
              "organization": {
                  "id": 1,
                  "title": "AI4Bharat",
                  "email_domain_name": "ai4bharat.org",
                  "created_by": {
                      "username": "shoonya",
                      "email": "shoonya@ai4bharat.org",
                      "first_name": "Admin",
                      "last_name": "AI4B",
                      "role": 6
                  },
                  "created_at": "2022-04-24T13:11:30.339610Z"
              },
              "unverified_email": "shoonya@ai4bharat.org",
              "date_joined": "2022-04-24T07:40:11Z",
              "participation_type": 3,
              "prefer_cl_ui": false,
              "is_active": true
          }
      ],
      "annotation_reviewers": [],
      "review_supercheckers": [],
      "frozen_users": [],
      "workspace_id": 1,
      "organization_id": 1,
      "filter_string": null,
      "sampling_mode": "f",
      "sampling_parameters_json": {},
      "project_type": "OCRSegmentCategorizationEditing",
      "variable_parameters": {},
      "project_mode": "Annotation",
      "required_annotators_per_task": 1,
      "tasks_pull_count_per_batch": 10,
      "max_pending_tasks_per_user": 60,
      "src_language": null,
      "tgt_language": null,
      "created_at": "2023-12-06T06:37:58.364413Z",
      "project_stage": 1,
      "revision_loop_count": 3,
      "k_value": 100,
      "metadata_json": null,
      "datasets": [
          {
              "instance_id": 295,
              "instance_name": "Test OCR"
          }
      ],
      "status": "Published",
      "task_creation_status": "Tasks Creation Process Successful",
      "last_project_export_status": "Success",
      "last_project_export_date": "Synchronously Completed. No Date.",
      "last_project_export_time": "Synchronously Completed. No Time.",
      "last_pull_status": "Success",
      "last_pull_date": "Synchronously Completed. No Date.",
      "last_pull_time": "Synchronously Completed. No Time.",
      "last_pull_result": "No result.",
      "unassigned_task_count": 29,
      "labeled_task_count": 0,
      "reviewed_task_count": 0
  }
  const [loading, setLoading] = useState(false);
    const [annotationreviewertype, setAnnotationreviewertype] = useState("Annotation Reports");
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    const isAnnotators =
      (userRole.WorkspaceManager === loggedInUserData?.role ||
        userRole.OrganizationOwner === loggedInUserData?.role ||
        userRole.Admin === loggedInUserData?.role || ProjectDetails?.project_stage === 1 ||
        ProjectDetails?.annotators?.some((user) => user.id === userDetails.id));
  
    const isReviewer =
      ((userRole.WorkspaceManager === loggedInUserData?.role ||
        userRole.OrganizationOwner === loggedInUserData?.role ||
        userRole.Admin === loggedInUserData?.role) ? (ProjectDetails?.project_stage == 2 || ProjectDetails?.project_stage == 3) :
      ProjectDetails?.annotation_reviewers?.some(
        (reviewer) => reviewer.id === userDetails?.id
      ));
    const isSuperChecker =
      ((userRole.WorkspaceManager === loggedInUserData?.role ||
        userRole.OrganizationOwner === loggedInUserData?.role ||
        userRole.Admin === loggedInUserData?.role) ? ProjectDetails?.project_stage == 3 : false ||
      ProjectDetails?.review_supercheckers?.some(
        (superchecker) => superchecker.id === userDetails?.id
      ));
  
    const allTask =
      userRole.WorkspaceManager === loggedInUserData?.role ||
      userRole.OrganizationOwner === loggedInUserData?.role ||
      userRole.Admin === loggedInUserData?.role;
  

  
    let projectdata = ProjectDetails?.annotators?.filter((x) => {
      return ProjectDetails?.annotation_reviewers?.find(
        (choice) => choice.id === x.id
      );
    });
  
    let data = projectdata?.filter((x) => {
      return userDetails.id == x.id;
    });
  
    let annotationdata = ProjectDetails?.annotators?.filter(
      (x) => x.id == userDetails.id
    );
    let reviewerdata = ProjectDetails?.annotation_reviewers?.filter(
      (x) => x.id == userDetails.id
    );
    const router = useRouter();
    const handleOpenSettings = () => {
       router.push('/ProjectSettings');
    };
  
    let projectValue = "Unassigned Super Check Tasks"
    const filterdata = projectData.filter(item => item.name !== projectValue)
    const projectFilterData = isSuperChecker ? projectData : filterdata || []
  
  
    const TabPanData = [
      {
        tabEle: (
          <Tab
            label={translate("label.annotationTasks")}
            sx={{ fontSize: 16, fontWeight: "700" }}
          />
        ),
        tabPanelEle: (
          <TaskTable type="annotation" ProjectDetails={ProjectDetails} />
        ),
        showTab: isAnnotators,
      },
      {
        tabEle: (
          <Tab
            label={translate("label.reviewTasks")}
            sx={{ fontSize: 16, fontWeight: "700" }}
          />
        ),
        tabPanelEle: <TaskTable type="review" />,
        showTab: isReviewer,
      },
      {
        tabEle: (
          <Tab
            label="Super Check Tasks"
            sx={{ fontSize: 16, fontWeight: "700" }}
          />
        ),
        // tabPanelEle: <SuperCheckerTasks type="superChecker" />,
        showTab: isSuperChecker,
      },
  
      {
        tabEle: (
          <Tab
            label={translate("label.annotators")}
            sx={{ fontSize: 16, fontWeight: "700" }}
          />
        ),
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
        tabEle: (
          <Tab
            label={translate("label.reviewers")}
            sx={{ fontSize: 16, fontWeight: "700" }}
          />
        ),
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
        tabEle: (
          <Tab
            label="Super Checkers "
            sx={{ fontSize: 16, fontWeight: "700" }}
          />
        ),
        tabPanelEle: (
          <MembersTable
            dataSource={ProjectDetails.review_supercheckers}
            type={addUserTypes.PROJECT_SUPERCHECKER}
          />
        ),
        showTab: isSuperChecker,
  
      },
  
      {
        tabEle: (
          <Tab
            label={translate("label.reports")}
            sx={{
              fontSize: 16,
              fontWeight: "700",
              flexDirection: "row-reverse",
            }}
            onClick={handleClick}
          />
        ),
        tabPanelEle: (
          <ReportsTable
            annotationreviewertype={annotationreviewertype}
            userDetails={userDetails}
            isAnnotators={isAnnotators}
            isReviewer={isReviewer}
            isSuperChecker={isSuperChecker}
          />
        ),
        showTab: (isAnnotators || isReviewer || isSuperChecker)
      },
  
      {
        tabEle: (
          <Tab label="All Tasks" sx={{ fontSize: 16, fontWeight: "700" }} />
        ),
        // tabPanelEle: <AllTaskTable />,
        showTab: allTask,
      },
    ];
  
    const filteredTabPanData = TabPanData.filter((el, i) => el.showTab);
  
    const renderTabs = () => {
      return (
        <>
          <Grid>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                {filteredTabPanData.map((el, i) => {
                  return el.tabEle;
                })}
              </Tabs>
            </Box>
          </Grid>
          {filteredTabPanData.map((el, i, array) => {
            return (
              <>
  
                <TabPanel value={value} index={i}>
                  {el.tabPanelEle}
  
                </TabPanel>
              </>
            )
          })}
  
        </>
      );
    };
  
    return (
      <ThemeProvider theme={themeDefault}>
        {/* <Header /> */}
        {loading && <Spinner />}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Card
            sx={{
              width: "100%",
              minHeight: 500,
              padding: 5,
            }}
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                <Typography variant="h3">{ProjectDetails.title}</Typography>
              </Grid>
  
              {(
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Tooltip title={translate("label.showProjectSettings")}>
                    <Link href="/ProjectSettings" passHref>
                      <IconButton
                        sx={{ marginLeft: "140px" }}
                        onClick={handleOpenSettings}
                      >
                        <SettingsOutlinedIcon
                          color="primary.dark"
                          fontSize="large"
                        />
                      </IconButton>
                      </Link>
                    </Tooltip>
                  </Grid>
                )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                {projectFilterData?.map((des, i) => (
                  <Grid key={i} item xs={isSuperChecker?3:4} sm={isSuperChecker?3:4} md={isSuperChecker?3:4} lg={isSuperChecker?3:4} xl={isSuperChecker?3:4}>
                    <ProjectDescription
                      name={des.name}
                      value={des.value}
                      index={i}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {renderTabs()}
          </Card>
        </Grid>
      </ThemeProvider>
    );
  };
  
  
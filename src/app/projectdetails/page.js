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
  // import Header from "../../component/common/Header";
  import themeDefault from "../../themes/theme";
  import { Link, useNavigate, useParams, useHistory } from "react-router-dom";
  import TaskTable from "../components/Project/TaskTable";
  import MembersTable from "../components/Project/MembersTable";
  import ReportsTable from "../components/Project/ReportsTable";
  // import { useDispatch, useSelector } from "react-redux";
  // import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
  // import APITransport from "../../../../redux/actions/apitransport/apitransport";
  import { translate } from "../../config/localisation";
  // import TabPanel from "../../component/common/TabPanel";
  import addUserTypes from "../Constants/addUserTypes";
  import Spinner from "../components/common/Spinner";
  import Menu from "@mui/material/Menu";
  import { styled, alpha } from "@mui/material/styles";
  import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
  import DatasetStyle from "../../styles/Dataset";
  import ProjectDescription from "../components/Tabs/ProjectDescription";
  import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
  import AllTaskTable from "../components/Project/AllTaskTable";
  import userRole from "../../utils/UsersRolesList";
  import SuperCheckerTasks from "../components/Project/SuperCheckerTasks";
  import SuperChecker from "../components/Project/SuperChecker";
  
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
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));
  const Projects = () => {
    // console.log("props", props)
    // const { id } = useParams();
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
    // let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    // const dispatch = useDispatch();
    // const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
    // const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
    // const loggedInUserData = useSelector(
    //   (state) => state.fetchLoggedInUserData.data
    // );
    // const getProjectDetails = () => {
    //   const projectObj = new GetProjectDetailsAPI(id);
  
    //   dispatch(APITransport(projectObj));
    // };
    
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
    const ProjectDetails = [{
      "id": 1375,
      "title": "English Nepali Conversation Translation - AI4B Inhouse",
      "description": "English Nepali Conversation Translation - AI4B Inhouse",
      "created_by": null,
      "is_archived": false,
      "is_published": true,
      "annotators": [
          {
              "id": 148,
              "username": "dhakaram.kafle@gmail.com",
              "email": "dhakaram.kafle@gmail.com",
              "languages": [
                  "Nepali"
              ],
              "availability_status": 1,
              "enable_mail": false,
              "first_name": "Dhaka Ram",
              "last_name": "Kafle",
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
              "unverified_email": "",
              "date_joined": "2022-05-09T04:59:26.793053Z",
              "participation_type": 1,
              "prefer_cl_ui": false,
              "is_active": true
          },
          {
              "id": 146,
              "username": "Tika Bhai",
              "email": "tikabhai123@gmail.com",
              "languages": [
                  "Nepali",
                  "English"
              ],
              "availability_status": 1,
              "enable_mail": false,
              "first_name": "Tika Ram",
              "last_name": "Rai",
              "phone": "8695319811",
              "profile_photo": "",
              "role": 3,
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
              "unverified_email": "",
              "date_joined": "2022-05-09T04:59:26.684137Z",
              "participation_type": 1,
              "prefer_cl_ui": false,
              "is_active": true
          },
          {
              "id": 189,
              "username": "D. Ghimiray",
              "email": "deoghims@gmail.com",
              "languages": [
                  "Nepali"
              ],
              "availability_status": 1,
              "enable_mail": true,
              "first_name": "Deobrata",
              "last_name": "Ghimiray",
              "phone": "9547793421",
              "profile_photo": "",
              "role": 1,
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
              "unverified_email": "",
              "date_joined": "2022-05-09T10:30:52.972601Z",
              "participation_type": 1,
              "prefer_cl_ui": false,
              "is_active": true
          },
          {
              "id": 140,
              "username": "OTR2TX58Z2O5",
              "email": "khagen.sharma@gmail.com",
              "languages": [],
              "availability_status": 1,
              "enable_mail": false,
              "first_name": "",
              "last_name": "",
              "phone": "",
              "profile_photo": "",
              "role": 1,
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
              "unverified_email": "",
              "date_joined": "2022-05-09T04:58:01Z",
              "participation_type": 1,
              "prefer_cl_ui": false,
              "is_active": true
          },
          {
              "id": 70,
              "username": "sunita_nepali",
              "email": "suni.ntmorg@gmail.com",
              "languages": [
                  "English",
                  "Nepali"
              ],
              "availability_status": 1,
              "enable_mail": false,
              "first_name": "Sunita",
              "last_name": "Dahal",
              "phone": "7829069192",
              "profile_photo": "",
              "role": 4,
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
              "unverified_email": "",
              "date_joined": "2022-04-28T08:42:42Z",
              "participation_type": 1,
              "prefer_cl_ui": false,
              "is_active": true
          },
          {
              "id": 147,
              "username": "Lekhnath Chhetri",
              "email": "lekhnathchhetri960@gmail.com",
              "languages": [
                  "Nepali",
                  "English"
              ],
              "availability_status": 1,
              "enable_mail": false,
              "first_name": "Lekhnath",
              "last_name": "Chhetri",
              "phone": "+919593092284",
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
              "unverified_email": "",
              "date_joined": "2022-05-09T04:59:26.738863Z",
              "participation_type": 1,
              "prefer_cl_ui": false,
              "is_active": true
          },
          {
              "id": 334,
              "username": "Bikash Chandra",
              "email": "pragyam.foundation@gmail.com",
              "languages": [
                  "Bodo",
                  "Assamese",
                  "Nepali"
              ],
              "availability_status": 1,
              "enable_mail": true,
              "first_name": "",
              "last_name": "",
              "phone": "",
              "profile_photo": "",
              "role": 5,
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
              "unverified_email": "",
              "date_joined": "2022-08-07T12:45:59.421079Z",
              "participation_type": 3,
              "prefer_cl_ui": false,
              "is_active": true
          },
          {
              "id": 333,
              "username": "Avinash Kumar",
              "email": "avinash.kumar@aripanafoundation.org",
              "languages": [],
              "availability_status": 1,
              "enable_mail": false,
              "first_name": "",
              "last_name": "",
              "phone": "",
              "profile_photo": "",
              "role": 4,
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
              "unverified_email": "",
              "date_joined": "2022-08-07T12:45:59Z",
              "participation_type": 3,
              "prefer_cl_ui": false,
              "is_active": true
          }
      ],
      "annotation_reviewers": [
          {
              "id": 146,
              "username": "Tika Bhai",
              "email": "tikabhai123@gmail.com",
              "languages": [
                  "Nepali",
                  "English"
              ],
              "availability_status": 1,
              "enable_mail": false,
              "first_name": "Tika Ram",
              "last_name": "Rai",
              "phone": "8695319811",
              "profile_photo": "",
              "role": 3,
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
              "unverified_email": "",
              "date_joined": "2022-05-09T04:59:26.684137Z",
              "participation_type": 1,
              "prefer_cl_ui": false,
              "is_active": true
          }
      ],
      "review_supercheckers": [],
      "frozen_users": [],
      "workspace_id": 10,
      "organization_id": 1,
      "filter_string": "language=English&conversation_quality_status=Clean",
      "sampling_mode": "f",
      "sampling_parameters_json": {},
      "project_type": "ConversationTranslation",
      "label_config": "<View>\n\n</View>",
      "variable_parameters": {
          "language": "Nepali"
      },
      "project_mode": "Annotation",
      "required_annotators_per_task": 1,
      "tasks_pull_count_per_batch": 10,
      "max_pending_tasks_per_user": 60,
      "src_language": "English",
      "tgt_language": "Nepali",
      "created_at": "2023-06-27T02:27:59.508396Z",
      "project_stage": 2,
      "revision_loop_count": 3,
      "k_value": 100,
      "metadata_json": null,
      "datasets": [
          {
              "instance_id": 253,
              "instance_name": "Conversations Data - AI4B Inhouse - Regular tasks - - New"
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
      "unassigned_task_count": 5,
      "labeled_task_count": 1,
      "reviewed_task_count": 796
  }]
    useEffect(() => {
      // getProjectDetails();
      const projectStatus = ProjectDetails.is_archived
        ? "Archived"
        : ProjectDetails.is_published
          ? "Published"
           :"Draft";
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
    }, [ProjectDetails.id]);
    const [loading, setLoading] = useState(false);
    const [annotationreviewertype, setAnnotationreviewertype] = useState();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    // const apiLoading = useSelector((state) => state.apiStatus.loading);
  
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
  
  
    // useEffect(() => {
    //   setLoading(apiLoading);
    // }, [apiLoading]);
  
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
    useEffect(() => {
      if (annotationdata?.length && !reviewerdata?.length) {
        setAnnotationreviewertype("Annotation Reports");
      } else if (reviewerdata?.length && !annotationdata?.length) {
        setAnnotationreviewertype("Reviewer Reports");
      }
    }, [annotationdata, reviewerdata]);
  
    const handleOpenSettings = () => {
      navigate(`/projects/${id}/projectsetting`);
    };
  
  
    let projectValue = "Unassigned Super Check Tasks"
    const filterdata = projectData.filter(item => item.name !== projectValue)
    const projectFilterData = isSuperChecker ? projectData : filterdata
  
  
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
        tabPanelEle: <SuperCheckerTasks type="superChecker" />,
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
            onRemoveSuccessGetUpdatedMembers={() => getProjectDetails()}
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
        tabPanelEle: <AllTaskTable />,
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
              // width: window.innerWidth * 0.8,
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
  
              {(userRole.WorkspaceManager === loggedInUserData?.role ||
                userRole.OrganizationOwner === loggedInUserData?.role ||
                userRole.Admin === loggedInUserData?.role) && (
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Tooltip title={translate("label.showProjectSettings")}>
                      <IconButton
                        onClick={handleOpenSettings}
                        sx={{ marginLeft: "140px" }}
                      >
                        <SettingsOutlinedIcon
                          color="primary.dark"
                          fontSize="large"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                {projectFilterData?.map((des, i) => (
                  <Grid item xs={isSuperChecker?3:4} sm={isSuperChecker?3:4} md={isSuperChecker?3:4} lg={isSuperChecker?3:4} xl={isSuperChecker?3:4}>
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
  
  export default Projects;
  
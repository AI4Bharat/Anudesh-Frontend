import { Card, CircularProgress, Grid, ThemeProvider, Typography, Select, Box, MenuItem, InputLabel } from "@mui/material";
import themeDefault from "../../../themes/theme";
// import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
// import GetWorkspaceAPI from "../../../../redux/actions/api/Organization/GetWorkspace";
// import CreateScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/CreateScheduledMails";
// import GetScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/GetScheduledMails";
// import UpdateScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/UpdateScheduledMails";
// import DeleteScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/DeleteScheduledMails";
import Snackbar from "../../components/common/Snackbar";
// import { MenuProps } from "../../../utils/utils";
import CustomButton from "../../components/common/Button";
import FormControl from "@mui/material/FormControl";
import tableTheme from "../../../themes/tableTheme";
import MUIDataTable from "mui-datatables";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from "../../components/common/ColumnList";
import userRole from "../../../utils/Role";

const ScheduleMails = () => {
//   const { id } = useParams();
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: '' });
  const [reportLevel, setReportLevel] = useState(1);
  const [selectedProjectType, setSelectedProjectType] = useState("AllAudioProjects");
  const [projectTypes, setProjectTypes] = useState([
    "AudioSegmentation",
    "AudioTranscription",
    "AudioTranscriptionEditing",
    "ConversationTranslation",
    "ConversationTranslationEditing",
    "AcousticNormalisedTranscriptionEditing",
    "AllAudioProjects",
    "OCRTranscription",
    "OCRTranscriptionEditing",
  ]);
  const [schedule, setSchedule] = useState("Daily");
  const [scheduleDay, setScheduleDay] = useState(1);
  const [workspaceId, setWorkspaceId] = useState(0);
  const [workspaces, setWorkspaces] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const classes = DatasetStyle();
//   const dispatch = useDispatch();
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
const LoggedInUserId=1
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
  const workspaceData = [

    {
        "organization": 1,
        "workspace_name": "Tamil Workspace",
        "managers": [
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
            },
            {
                "id": 10,
                "username": "Janki",
                "email": "jankinawale01@gmail.com",
                "languages": [],
                "availability_status": 1,
                "enable_mail": false,
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
                "date_joined": "2022-04-27T09:13:40Z",
                "participation_type": 3,
                "prefer_cl_ui": false,
                "is_active": true
            },
            {
                "id": 9,
                "username": "Ishvinder",
                "email": "ishvinder@ai4bharat.org",
                "languages": [
                    "English",
                    "Hindi"
                ],
                "availability_status": 1,
                "enable_mail": false,
                "first_name": "Ishvinder",
                "last_name": "Sethi",
                "phone": "",
                "profile_photo": "https://shoonyastoragedevelop.blob.core.windows.net/images/Ishvinder.png",
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
                "unverified_email": "",
                "date_joined": "2022-04-26T16:27:51Z",
                "participation_type": 3,
                "prefer_cl_ui": false,
                "is_active": true
            },
            {
                "id": 88,
                "username": "Shakir Azeem",
                "email": "shakirazeem2k@gmail.com",
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
                "date_joined": "2022-04-28T08:44:31.596366Z",
                "participation_type": 1,
                "prefer_cl_ui": false,
                "is_active": true
            }
        ],
        "is_archived": false,
        "created_by": {
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
        },
        "id": 2,
        "created_at": "2022-04-24T13:11:30.339610Z",
        "frozen_users": [],
        "public_analytics": true
    }
    
]
const scheduledMails = []


  // useEffect(() => {
  //   workspaceData && workspaceData.length > 0 && setWorkspaces(workspaceData);
  // }, [workspaceData]);

  // useEffect(() => {
  //   if (scheduledMails?.length) {
  //     let tempColumns = [];
  //     let tempSelected = [];
  //     Object.keys(scheduledMails[0]).forEach((key) => {
  //       tempColumns.push({
  //         name: key,
  //         label: key,
  //         options: {
  //           filter: false,
  //           sort: true,
  //           align: "center",
  //         },
  //       });
  //       key !== "id" && tempSelected.push(key);
  //     });
  //     tempColumns.push({
  //       name: "Actions",
  //       label: "Actions",
  //       options: {
  //         filter: false,
  //         sort: true,
  //         align: "center",
  //       },
  //     });
  //     tempSelected.push("Actions");
  //     scheduledMails.map((mail) => {
  //       mail.Actions = (
  //         <Box
  //           sx={{
  //             display: "flex",
  //             justifyContent: "space-between",
  //             gap: 2,
  //           }}
  //         >
  //           <CustomButton
  //             label={mail["Status"] === "Enabled" ? "Pause" : "Resume"}
  //             onClick={() => updateScheduledMail(mail)} />
  //           <CustomButton
  //             label="Delete"
  //             sx={{ backgroundColor: "#EC0000" }}
  //             onClick={() => deleteScheduledMail(mail)} />
  //         </Box>
  //       );
  //       return mail;
  //     });
  //     setColumns(tempColumns);
  //     setTableData(scheduledMails);
  //     setSelectedColumns(tempSelected);
  //   } else {
  //     setColumns([]);
  //     setTableData([]);
  //     setSelectedColumns([]);
  //   }
  //   setShowSpinner(false);
  // }, [scheduledMails]);

  const renderToolBar = () => {
    return (
      <Box
        className={classes.ToolbarContainer}
      >
        <ColumnList
          columns={columns}
          setColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
      </Box>
    )
  }

  const tableOptions = {
    filterType: 'checkbox',
    selectableRows: "none",
    download: true,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
  };

  return (
    <ThemeProvider theme={themeDefault}>
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
            border: 0,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h3" align="center">
                Schedule Emails (Payment Reports)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="report-level-label" sx={{ fontSize: "16px" }}>Report Level</InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                //   MenuProps={MenuProps}
                  labelId="report-level-label"
                  id="report-level-select"
                  value={reportLevel}
                  label="Report Level"
                  onChange={(e) => setReportLevel(e.target.value)}
                >
                  {(userRole.OrganizationOwner === userDetails?.role || userRole.Admin === userDetails?.role) &&
                    <MenuItem value={1}>Organization</MenuItem>
                  }
                  <MenuItem value={2}>Workspace</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="workspace-label" sx={{ fontSize: "16px" }}>Workspace</InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                //   MenuProps={MenuProps}
                  labelId="workspace-label"
                  id="workspace-select"
                  value={workspaceId}
                  label="Workspace"
                  onChange={(e) => setWorkspaceId(e.target.value)}
                  disabled={reportLevel === 1 || !(workspaceData && workspaceData.length > 0)}
                >
                  {workspaces.map((w, index) => (
                    <MenuItem value={w.id} key={index}>
                      {w.workspace_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>Project Type</InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                //   MenuProps={MenuProps}
                  labelId="project-type-label"
                  id="project-type-select"
                  value={selectedProjectType}
                  label="Project Type"
                  onChange={(e) => setSelectedProjectType(e.target.value)}
                >
                  {projectTypes.map((type, index) => (
                    <MenuItem value={type} key={index}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="schedule-label" sx={{ fontSize: "16px" }}>Schedule</InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                //   MenuProps={MenuProps}
                  labelId="schedule-label"
                  id="schedule-select"
                  value={schedule}
                  label="Schedule"
                  onChange={(e) => setSchedule(e.target.value)}
                >
                  <MenuItem value={"Daily"}>Daily</MenuItem>
                  <MenuItem value={"Weekly"}>Weekly</MenuItem>
                  <MenuItem value={"Monthly"}>Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {schedule === "Weekly" && <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="weekday-label" sx={{ fontSize: "16px" }}>Day of Week</InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                //   MenuProps={MenuProps}
                  labelId="weekday-label"
                  id="weekday-select"
                  value={scheduleDay}
                  label="Day of Week"
                  onChange={(e) => setScheduleDay(e.target.value)}
                >
                  <MenuItem value={0}>Sunday</MenuItem>
                  <MenuItem value={1}>Monday</MenuItem>
                  <MenuItem value={2}>Tuesday</MenuItem>
                  <MenuItem value={3}>Wednesday</MenuItem>
                  <MenuItem value={4}>Thursday</MenuItem>
                  <MenuItem value={5}>Friday</MenuItem>
                  <MenuItem value={6}>Saturday</MenuItem>
                </Select>
              </FormControl>
            </Grid>}
            {schedule === "Monthly" && <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="month-day-label" sx={{ fontSize: "16px" }}>Day of Month</InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                //   MenuProps={MenuProps}
                  labelId="month-day-label"
                  id="month-day-select"
                  value={scheduleDay}
                  label="Day of Month"
                  onChange={(e) => setScheduleDay(e.target.value)}
                >
                  {Array.from(Array(28).keys()).map((day, index) => (
                    <MenuItem value={day + 1} key={index}>
                      {day + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>}
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <CustomButton
                label="+ Add"
                // onClick={createScheduledMail}
              />
            </Grid>
            {showSpinner ? <div></div> : tableData && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <ThemeProvider theme={tableTheme}>
                  <MUIDataTable
                    title={""}
                    data={tableData}
                    columns={columns.filter((col) => selectedColumns.includes(col.name))}
                    options={tableOptions}
                  />
                </ThemeProvider></Grid>)
            }
          </Grid>
        </Card>
      </Grid>
      <Snackbar
        {...snackbarState}
        handleClose={() => setSnackbarState({ ...snackbarState, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        hide={2000}
      />
    </ThemeProvider>
  );
};

export default ScheduleMails;

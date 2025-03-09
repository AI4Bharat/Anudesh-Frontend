import { styled} from "@mui/material";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import React from "react";
import TaskAnalyticsDataAPI from "@/app/actions/api/Progress/TaskAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import LightTooltip from "@/components/common/Tooltip";
import { translate } from "@/config/localisation";
import InfoIcon from '@mui/icons-material/Info';
import TaskCountAnalyticsChart from "./TaskCountAnalyticsChart";
import { MenuProps } from "@/utils/utils";
import CustomButton from "@/components/common/Button";
import { fetchTaskAnalyticsData } from "@/Lib/Features/Analytics/getTaskAnalyticsData";
import CustomizedSnackbars from "@/components/common/Snackbar";
import exportFromJSON from 'export-from-json';
import jsPDF from 'jspdf';
import { KeyboardArrowDown } from "@material-ui/icons";
import wsTaskAnalyticsAPI from "@/app/actions/api/Progress/wsTaskAnalyticsAPI";
import { fetchwsTaskAnalyticsData } from "@/Lib/Features/Analytics/Workspace/wsgetTaskAnalytics";
const StyledMenu = styled((props) => (
  <Menu
    elevation={3}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,


  },
}));

const TaskAnalytics = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const dispatch = useDispatch();
  const [projectTypes, setProjectTypes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [submit,setsubmit] = useState(false);
  const [isWorkspaceLevel, setIsWorkspaceLevel] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const workspaces = [    {
    "organization": 1,
    "workspace_name": "AI4B Guest Workspace ~480",
    "managers": [
        {
            "id": 516,
            "username": "sounakd",
            "email": "sounakdutta@ai4bharat.org",
            "languages": [],
            "availability_status": 1,
            "enable_mail": false,
            "first_name": "",
            "last_name": "",
            "phone": "",
            "gender": "",
            "address": "",
            "city": "",
            "state": "",
            "pin_code": "",
            "age": "",
            "qualification": "",
            "guest_user": false,
            "profile_photo": "",
            "role": 5,
            "organization": {
                "id": 1,
                "title": "Anudesh",
                "email_domain_name": "anudesh@ai4bharat.org",
                "created_by": {
                    "username": "Anudesh Admin",
                    "email": "anudesh@ai4bharat.org",
                    "first_name": "",
                    "last_name": "",
                    "role": 6
                },
                "created_at": "2024-01-05T09:37:15.899691Z"
            },
            "unverified_email": "",
            "date_joined": "2024-10-21T09:53:35Z",
            "participation_type": 1,
            "prefer_cl_ui": false,
            "is_active": true
        }
    ],
    "is_archived": false,
    "created_by": {
        "id": 2,
        "username": "Anudesh Admin",
        "email": "anudesh@ai4bharat.org",
        "languages": [
            "Bengali",
            "Bodo",
            "Assamese"
        ],
        "availability_status": 1,
        "enable_mail": false,
        "first_name": "",
        "last_name": "",
        "phone": "7l",
        "gender": "F",
        "address": "IIT Madras, Chennai",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "pin_code": "769002",
        "age": "22",
        "qualification": "b.e",
        "guest_user": false,
        "profile_photo": "",
        "role": 6,
        "organization": {
            "id": 1,
            "title": "Anudesh",
            "email_domain_name": "anudesh@ai4bharat.org",
            "created_by": {
                "username": "Anudesh Admin",
                "email": "anudesh@ai4bharat.org",
                "first_name": "",
                "last_name": "",
                "role": 6
            },
            "created_at": "2024-01-05T09:37:15.899691Z"
        },
        "unverified_email": "",
        "date_joined": "2023-12-18T06:30:06Z",
        "participation_type": 1,
        "prefer_cl_ui": false,
        "is_active": true
    },
    "id": 162,
    "created_at": "2024-11-15T14:50:12.189728Z",
    "guest_workspace_display": "Yes",
    "frozen_users": [],
    "public_analytics": true
},
{
  "organization": 1,
  "workspace_name": "AI4B Guest Workspace",
  "managers": [],
  "is_archived": false,
  "created_by": {
      "id": 2,
      "username": "Anudesh Admin",
      "email": "anudesh@ai4bharat.org",
      "languages": [
          "Bengali",
          "Bodo",
          "Assamese"
      ],
      "availability_status": 1,
      "enable_mail": false,
      "first_name": "",
      "last_name": "",
      "phone": "7l",
      "gender": "F",
      "address": "IIT Madras, Chennai",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "pin_code": "769002",
      "age": "22",
      "qualification": "b.e",
      "guest_user": false,
      "profile_photo": "",
      "role": 6,
      "organization": {
          "id": 1,
          "title": "Anudesh",
          "email_domain_name": "anudesh@ai4bharat.org",
          "created_by": {
              "username": "Anudesh Admin",
              "email": "anudesh@ai4bharat.org",
              "first_name": "",
              "last_name": "",
              "role": 6
          },
          "created_at": "2024-01-05T09:37:15.899691Z"
      },
      "unverified_email": "",
      "date_joined": "2023-12-18T06:30:06Z",
      "participation_type": 1,
      "prefer_cl_ui": false,
      "is_active": true
  },
  "id": 152,
  "created_at": "2024-11-05T06:44:38.888299Z",
  "guest_workspace_display": "Yes",
  "frozen_users": [],
  "public_analytics": true
}, {
  "organization": 1,
  "workspace_name": "IBM Guest Workspace",
  "managers": [],
  "is_archived": false,
  "created_by": {
      "id": 2,
      "username": "Anudesh Admin",
      "email": "anudesh@ai4bharat.org",
      "languages": [
          "Bengali",
          "Bodo",
          "Assamese"
      ],
      "availability_status": 1,
      "enable_mail": false,
      "first_name": "",
      "last_name": "",
      "phone": "7l",
      "gender": "F",
      "address": "IIT Madras, Chennai",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "pin_code": "769002",
      "age": "22",
      "qualification": "b.e",
      "guest_user": false,
      "profile_photo": "",
      "role": 6,
      "organization": {
          "id": 1,
          "title": "Anudesh",
          "email_domain_name": "anudesh@ai4bharat.org",
          "created_by": {
              "username": "Anudesh Admin",
              "email": "anudesh@ai4bharat.org",
              "first_name": "",
              "last_name": "",
              "role": 6
          },
          "created_at": "2024-01-05T09:37:15.899691Z"
      },
      "unverified_email": "",
      "date_joined": "2023-12-18T06:30:06Z",
      "participation_type": 1,
      "prefer_cl_ui": false,
      "is_active": true
  },
  "id": 153,
  "created_at": "2024-11-05T06:45:54.070592Z",
  "guest_workspace_display": "Yes",
  "frozen_users": [],
  "public_analytics": true
}]; // Example workspaces

  const [selectedType, setSelectedType] = useState("AllTypes");
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  if(isWorkspaceLevel && submit == true){
    var taskAnalyticsData = useSelector(
      (state) => state.wsgetTaskAnalytics.data
    );
  
  }else{
    var taskAnalyticsData = useSelector(
      (state) => state.getTaskAnalyticsData.data
    );
  
  }
if(isWorkspaceLevel && submit==true){
  var taskAnalyticsDataJson = useSelector((state) => state.wsgetTaskAnalytics.originalData);

}else{
  var taskAnalyticsDataJson = useSelector((state) => state.getTaskAnalyticsData.originalData);

}
 

  const [loading, setLoading] = useState(false);
  console.log(selectedType);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const getTaskAnalyticsdata = () => {
    setLoading(true)
 
      const userObj = new TaskAnalyticsDataAPI(selectedType);
      dispatch(fetchTaskAnalyticsData({project_type_filter:selectedType}))
  
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };
  const audioProjectTypes=[
    'AudioTranscription',
    'AudioSegmentation',
    'AudioTranscriptionEditing',
    'AcousticNormalisedTranscriptionEditing'
  ]
  const translationProjectTypes=[
    'MonolingualTranslation',
    'TranslationEditing',
    'SemanticTextualSimilarity_Scale5',
    'ContextualTranslationEditing',
    'SentenceSplitting',
    'ContextualSentenceVerification',
    'ContextualSentenceVerificationAndDomainClassification',
  ]
  const conversationProjectTypes=[
    'ConversationTranslation',
    'ConversationTranslationEditing',
    'ConversationVerification'
  ]
  const ocrProjectTypes=[
    'OCRTranscriptionEditing',
  ]

  useEffect(() => {
    let types=["ModelOutputEvaluation","ModelInteractionEvaluation","MultipleInteractionEvaluation","InstructionDrivenChat",'AllTypes']
    setProjectTypes(types);
  }, []);

  useEffect(() => {
    getTaskAnalyticsdata();
  }, []);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    setLoading(true)
    if(isWorkspaceLevel){
      const userObj = new wsTaskAnalyticsAPI(selectedWorkspace,selectedType);
      dispatch(fetchwsTaskAnalyticsData({id:selectedWorkspace,project_type_filter:selectedType}))
      setsubmit(true)
    }
    else{
      const userObj = new TaskAnalyticsDataAPI(selectedType);
      dispatch(fetchTaskAnalyticsData({project_type_filter:selectedType}))
  
    }
  };

  useEffect(() => {
    if(taskAnalyticsData.length > 0){
      setLoading(false);
    }
  }, [taskAnalyticsData]);

  
  const downloadCSV = () => {
    if (taskAnalyticsDataJson) {
      const transformedData = Object.keys(taskAnalyticsDataJson).flatMap(projectType => {
        return taskAnalyticsDataJson[projectType].map(data => ({
          projectType,
          language: data.language,
          ann_cumulative_tasks_count: data.ann_cumulative_tasks_count,
          rew_cumulative_tasks_count: data.rew_cumulative_tasks_count,
        }));
      });

      const fileName = 'task_analytics';
      const exportType = exportFromJSON.types.csv;
      exportFromJSON({ data: transformedData, fileName, exportType });
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;
    const pageHeight = doc.internal.pageSize.height;
  
    doc.setFontSize(18);
    doc.text("Task Analytics Report", 10, yOffset);
    yOffset += 20;
  
    taskAnalyticsData.forEach((dataArray, index) => {
      if (dataArray.length) {
        const projectType = dataArray[0].projectType;
        doc.setFontSize(14);
        doc.text(`Project Type: ${projectType}`, 10, yOffset);
        yOffset += 10;
  
        doc.setFontSize(12);
        dataArray.forEach((data, i) => {
          doc.text(`Language: ${data.languages || 'N/A'}`, 10, yOffset);
          doc.text(`Ann Cumulative Tasks Count: ${data.annotation_cumulative_tasks_count || 'N/A'}`, 10, yOffset + 5);
          doc.text(`Rew Cumulative Tasks Count: ${data.review_cumulative_tasks_count || 'N/A'}`, 10, yOffset + 10);
          yOffset += 25;
  
          if (yOffset > pageHeight - 30) { 
            doc.addPage();
            yOffset = 10;
          }
        });
  
        yOffset += 10; 
      }
    });
  
    doc.save('task_analytics.pdf');
  };
  const downloadJSON = () => {
    if (taskAnalyticsDataJson) {
      const transformedData = Object.keys(taskAnalyticsDataJson).flatMap(projectType => {
        return taskAnalyticsDataJson[projectType].map(data => ({
          projectType,
          language: data.language,
          ann_cumulative_tasks_count: data.ann_cumulative_tasks_count,
          rew_cumulative_tasks_count: data.rew_cumulative_tasks_count,
        }));
      });

      const fileName = 'task_analytics';
      const exportType = exportFromJSON.types.json;
      exportFromJSON({ data: transformedData, fileName, exportType });
    }
  };  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };

  return (
    <>
      <Grid container columnSpacing={3} rowSpacing={2} mb={1} gap={{ xs: 0, sm: 3 }}>
        <Grid
          container
          item
          xs={12}
          spacing={2}
          alignItems="center"
        >
          {/* Project Type Dropdown */}
          <Grid item xs={12} sm={4}>
            <FormControl size="small" fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                sx={{ fontSize: "16px", zIndex: 0 }}
              >
                Project Type{" "}
                {
                  <LightTooltip
                    arrow
                    placement="top"
                    title={translate("tooltip.ProjectType")}
                  >
                    <InfoIcon fontSize="medium" />
                  </LightTooltip>
                }
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedType}
                label="Project Type"
                sx={{ padding: "1px" }}
                onChange={(e) => setSelectedType(e.target.value)}
                MenuProps={MenuProps}
              >
                {projectTypes.map((type, index) => (
                  <MenuItem value={type} key={index}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Workspace Level Checkbox */}
          <Grid item xs={12} sm={3}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isWorkspaceLevel}
                    onChange={(e) => setIsWorkspaceLevel(e.target.checked)}
                  />
                }
                labelPlacement="end"
                label="Workspace Level"
              />
            </Box>
          </Grid>
          
          {isWorkspaceLevel && (
          <Grid item xs={12} sm={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="workspace-dropdown-label">Workspace</InputLabel>
              <Select
                labelId="workspace-dropdown-label"
                id="workspace-dropdown"
                value={selectedWorkspace}
                label="Workspace"
                onChange={(e) => setSelectedWorkspace(e.target.value)}
              >
                {workspaces?.map((workspace, index) => (
                  <MenuItem value={workspace?.id} key={index}>
                    {workspace?.workspace_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        </Grid>
      </Grid>

      <Grid
        container
        columnSpacing={3}
        rowSpacing={2}
        alignItems="center"
        gap={2}
      >
        <Grid item xs={12} sm={12} md={6}>
          <Box display="flex" gap={2} alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }}>
            <CustomButton
              label="Submit"
              sx={{ width: { xs: "100%", sm: "45%" }, height: "40px", mb: { xs: 2, sm: 0 } }}
              onClick={handleSubmit}
              size="small"
            />

            {/* Download Button */}
            <Box display="flex" alignItems="center" sx={{ width: { xs: "100%", sm: "45%" } }}>
              <CustomButton
                onClick={handleClick}
                disabled={loading}
                sx={{ width: "100%", height: "40px" }}
                endIcon={<KeyboardArrowDown />}
                label="Download"
              >
                Download
              </CustomButton>
              <StyledMenu
                id="demo-customized-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={downloadCSV}>CSV</MenuItem>
                <MenuItem onClick={downloadPDF}>PDF</MenuItem>
                <MenuItem onClick={downloadJSON}>JSON</MenuItem>
              </StyledMenu>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {loading && <Spinner />}
      {taskAnalyticsData.length
        ? taskAnalyticsData.map((analyticsData, _index) => {
            if (analyticsData.length) {
              return (
                <Grid key={_index} item xs={12} sm={6} md={4} style={{ marginTop: "15px" }}>
                  <TaskCountAnalyticsChart analyticsData={analyticsData} />
                </Grid>
              );
            }
          })
        : ""}
      <CustomizedSnackbars
        message={snackbarMessage}
        open={snackbarOpen}
        hide={2000}
        handleClose={closeSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        variant="error"
      />
    </>
  );
};

export default TaskAnalytics;

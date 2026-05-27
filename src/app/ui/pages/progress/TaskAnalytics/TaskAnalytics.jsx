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
import { fetchWorkspaceData } from "@/Lib/Features/GetWorkspace";
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
    borderRadius: 10,
    marginTop: theme.spacing(1),
    minWidth: 120,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  },
}));

/* ── Premium inline style tokens ── */
const sxCard = {
  background: '#fff',
  borderRadius: '14px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  p: { xs: 2, sm: 3 },
  mb: 3,
};

const sxSelect = {
  borderRadius: '10px',
  fontSize: '0.875rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e2e8f0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#cbd5e1',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#f97316',
    borderWidth: '1.5px',
  },
};

const sxLabel = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: '#4b5563',
  zIndex: 0,
};

const sxBtn = {
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.8125rem',
  px: 3,
  height: '40px',
  boxShadow: 'none',
  '&:hover': { boxShadow: '0 2px 8px rgba(249,115,22,0.25)' },
};

const TaskAnalytics = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const dispatch = useDispatch();
  const [projectTypes, setProjectTypes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [submit,setsubmit] = useState(false);
  const [isWorkspaceLevel, setIsWorkspaceLevel] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const workspaces = useSelector((state) => state.GetWorkspace.data || []);
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

  useEffect(() => {
    dispatch(fetchWorkspaceData());
  }, [dispatch]);

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
      {/* ── Controls Card ── */}
      <Box sx={sxCard}>
        <Grid container spacing={2.5} alignItems="center">
          {/* Project Type Dropdown */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl size="small" fullWidth>
              <InputLabel id="task-project-type-label" sx={sxLabel}>
                Project Type{" "}
                {
                  <LightTooltip
                    arrow
                    placement="top"
                    title={translate("tooltip.ProjectType")}
                  >
                    <InfoIcon fontSize="small" sx={{ color: '#9ca3af', fontSize: '16px' }} />
                  </LightTooltip>
                }
              </InputLabel>
              <Select
                labelId="task-project-type-label"
                id="task-project-type-select"
                value={selectedType}
                label="Project Type"
                sx={sxSelect}
                onChange={(e) => setSelectedType(e.target.value)}
                MenuProps={MenuProps}
              >
                {projectTypes.map((type, index) => (
                  <MenuItem value={type} key={index} sx={{ fontSize: '0.8125rem' }}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Workspace Level Checkbox */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isWorkspaceLevel}
                    onChange={(e) => setIsWorkspaceLevel(e.target.checked)}
                    sx={{
                      color: '#cbd5e1',
                      '&.Mui-checked': { color: '#f97316' },
                    }}
                  />
                }
                labelPlacement="end"
                label="Workspace Level"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.8125rem', color: '#4b5563' }}}
              />
            </Box>
          </Grid>
          
          {isWorkspaceLevel && (
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="workspace-dropdown-label" sx={sxLabel}>Workspace</InputLabel>
              <Select
                labelId="workspace-dropdown-label"
                id="workspace-dropdown"
                value={selectedWorkspace}
                label="Workspace"
                sx={sxSelect}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
              >
                {workspaces?.map((workspace, index) => (
                  <MenuItem value={workspace?.id} key={index} sx={{ fontSize: '0.8125rem' }}>
                    {workspace?.workspace_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        </Grid>

        {/* Action Buttons */}
        <Box 
          display="flex" 
          gap={1.5} 
          alignItems="center" 
          flexWrap="wrap"
          sx={{ mt: 2.5 }}
        >
          <CustomButton
            label="Submit"
            sx={sxBtn}
            onClick={handleSubmit}
            size="small"
          />

          <Box display="flex" alignItems="center">
            <CustomButton
              onClick={handleClick}
              disabled={loading}
              sx={{
                ...sxBtn,
                backgroundColor: '#f8fafc',
                color: '#4b5563',
                border: '1px solid #e2e8f0',
                '&:hover': { 
                  backgroundColor: '#f1f5f9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                },
              }}
              buttonVariant="outlined"
              endIcon={<KeyboardArrowDown />}
              label="Download"
            >
              Download
            </CustomButton>
            <StyledMenu
              id="task-download-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={downloadCSV} sx={{ fontSize: '0.8125rem', py: 1 }}>CSV</MenuItem>
              <MenuItem onClick={downloadPDF} sx={{ fontSize: '0.8125rem', py: 1 }}>PDF</MenuItem>
              <MenuItem onClick={downloadJSON} sx={{ fontSize: '0.8125rem', py: 1 }}>JSON</MenuItem>
            </StyledMenu>
          </Box>
        </Box>
      </Box>

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

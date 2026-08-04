import { styled} from "@mui/material";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import { Card, Button } from "@mui/material";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { isSameDay, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
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
  const workspaces = useSelector((state) => state.GetWorkspace.data || []);
  const [selectedType, setSelectedType] = useState("AllTypes");
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const OrganizationDetails = useSelector((state) => state.getLoggedInData?.data?.organization);
  
  const [selectRange, setSelectRange] = useState([{
    startDate: (() => {
      let d = new Date(OrganizationDetails?.created_at);
      if (isNaN(d.getTime())) d = new Date("2021-01-01");
      return d;
    })(),
    endDate: new Date(),
    key: "selection",
  }]);
  
  const [isTillDate, setIsTillDate] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
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
    const fromDate = isTillDate ? "" : format(selectRange[0].startDate, "yyyy-MM-dd");
    const toDate = isTillDate ? "" : format(selectRange[0].endDate, "yyyy-MM-dd");
    dispatch(fetchTaskAnalyticsData({project_type_filter:selectedType, fromDate, toDate}))
  };

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    
    let createdDateStr = OrganizationDetails?.created_at;
    if (isWorkspaceLevel && selectedWorkspace) {
       const ws = workspaces.find(w => w.id == selectedWorkspace);
       if (ws && ws.created_at) {
           createdDateStr = ws.created_at;
       }
    }
    let createdDate = new Date(createdDateStr);
    if (isNaN(createdDate.getTime())) createdDate = new Date("2021-01-01");
    const isStart = isSameDay(selection.startDate, createdDate);
    const isToday = isSameDay(selection.endDate, new Date());
    setIsTillDate(isStart && isToday);
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
    const fromDate = isTillDate ? "" : format(selectRange[0].startDate, "yyyy-MM-dd");
    const toDate = isTillDate ? "" : format(selectRange[0].endDate, "yyyy-MM-dd");
    if(isWorkspaceLevel){
      dispatch(fetchwsTaskAnalyticsData({id:selectedWorkspace,project_type_filter:selectedType, fromDate, toDate}))
      setsubmit(true)
    }
    else{
      dispatch(fetchTaskAnalyticsData({project_type_filter:selectedType, fromDate, toDate}))
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
          <Grid item xs={12} sm={"auto"}>
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
                sx={{ padding: "1px", minWidth: 200 }}
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

          {/* Pick Dates Button */}
          <Grid item xs={12} sm={"auto"}>
            <Box display="flex" alignItems="center" height="100%">
              <Button
                endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained"
                color="primary"
                onClick={() => setShowPicker(!showPicker)}
                sx={{ width: { xs: "100%", sm: "130px" }, height: "40px" }}
              >
                Pick Dates
              </Button>
            </Box>
          </Grid>

        {/* Workspace Level Checkbox */}
          <Grid item xs={12} sm={"auto"}>
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
          <Grid item xs={12} sm={"auto"}>
            <FormControl fullWidth size="small">
              <InputLabel id="workspace-dropdown-label">Workspace</InputLabel>
              <Select
                labelId="workspace-dropdown-label"
                id="workspace-dropdown"
                value={selectedWorkspace}
                label="Workspace"
                sx={{ minWidth: 200 }}
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

        {/* Action Buttons */}
        <Grid item xs={12} sm={isWorkspaceLevel ? 6 : 4} md={4} lg={4}>
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
      
      {showPicker && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
          <Card sx={{ overflowX: "auto", maxWidth: "100%" }}>
            <DateRangePicker
              onChange={handleRangeChange}
              staticRanges={[
                ...defaultStaticRanges.filter(r => r.label !== 'Today' && r.label !== 'Yesterday' && r.label !== 'Tomorrow'),
                {
                  label: "This Year",
                  range: () => ({
                    startDate: new Date(new Date().getFullYear(), 0, 1),
                    endDate: new Date(),
                  }),
                  isSelected(range) {
                    const definedRange = this.range();
                    return isSameDay(range.startDate, definedRange.startDate) && isSameDay(range.endDate, definedRange.endDate);
                  },
                },
                {
                  label: "Last Year",
                  range: () => ({
                    startDate: new Date(new Date().getFullYear() - 1, 0, 1),
                    endDate: new Date(new Date().getFullYear() - 1, 11, 31),
                  }),
                  isSelected(range) {
                    const definedRange = this.range();
                    return isSameDay(range.startDate, definedRange.startDate) && isSameDay(range.endDate, definedRange.endDate);
                  },
                },
                {
                  label: "Till Date",
                  range: () => {
                    let createdDateStr = OrganizationDetails?.created_at;
                    if (isWorkspaceLevel && selectedWorkspace) {
                       const ws = workspaces.find(w => w.id == selectedWorkspace);
                       if (ws && ws.created_at) {
                           createdDateStr = ws.created_at;
                       }
                    }
                    let start = new Date(createdDateStr);
                    if (isNaN(start.getTime())) start = new Date("2021-01-01");
                    return {
                      startDate: start,
                      endDate: new Date(),
                    };
                  },
                  isSelected(range) {
                    const definedRange = this.range();
                    return isSameDay(range.startDate, definedRange.startDate) && isSameDay(range.endDate, definedRange.endDate);
                  },
                },
              ]}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={selectRange}
              maxDate={new Date()}
              direction="horizontal"
            />
          </Card>
        </Box>
      )}

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

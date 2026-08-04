import { Grid, Select, MenuItem, InputLabel, FormControl, Box, styled, Menu, Button, Card } from "@mui/material";
import React from "react";
// import TaskAnalyticsDataAPI from "@/app/actions/api/Progress/TaskAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import LightTooltip from "@/components/common/Tooltip";
import { translate } from "@/config/localisation";
import InfoIcon from '@mui/icons-material/Info';
// import AudioTaskAnalyticsChart from "./AudioTaskAnalyticsChart";
import { MenuProps } from "@/utils/utils";
import CustomButton from "@/components/common/Button";
import { fetchTaskAnalyticsData } from "@/Lib/Features/Analytics/getTaskAnalyticsData";
import CustomizedSnackbars from "@/components/common/Snackbar";
import { fetchwsTaskAnalyticsData } from "@/Lib/Features/Analytics/Workspace/wsgetTaskAnalytics";
import TaskCountAnalyticsChart from "../TaskAnalytics/TaskCountAnalyticsChart";
import wsTaskAnalyticsAPI from "@/app/actions/api/Progress/wsTaskAnalyticsAPI";
import exportFromJSON from 'export-from-json';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { KeyboardArrowDown } from "@material-ui/icons";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { isSameDay, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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


const TaskAnalytics = () => {
    /* eslint-disable react-hooks/exhaustive-deps */

  const dispatch = useDispatch();
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("AllTypes");
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const workspaceDetails = useSelector((state) => state.getWorkspaceDetails.data);
  const taskAnalyticsData = useSelector(
    (state) => state.wsgetTaskAnalytics.data
  );

  const taskAnalyticsDataJson = useSelector((state) => state.wsgetTaskAnalytics.originalData);

  const [loading, setLoading] = useState(false);
console.log(selectedType);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [selectRange, setSelectRange] = useState([{
    startDate: (() => {
      let d = new Date(workspaceDetails?.created_at);
      if (isNaN(d.getTime())) d = new Date("2021-01-01");
      return d;
    })(),
    endDate: new Date(),
    key: "selection",
  }]);

  const [isTillDate, setIsTillDate] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  const getTaskAnalyticsdata = () => {
    setLoading(true)
    dispatch(fetchwsTaskAnalyticsData({
      id:workspaceDetails?.id,
      project_type_filter:selectedType,
      fromDate: isTillDate ? "" : format(selectRange[0].startDate, "yyyy-MM-dd"),
      toDate: isTillDate ? "" : format(selectRange[0].endDate, "yyyy-MM-dd")
    }))
  };

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    
    let createdDate = new Date(workspaceDetails?.created_at);
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
    let types=["ModelOutputEvaluation","ModelInteractionEvaluation","InstructionDrivenChat",'AllTypes']
    setProjectTypes(types);
  }, []);

  useEffect(() => {
    getTaskAnalyticsdata();
  }, []);


  const handleSubmit = async () => {
      getTaskAnalyticsdata();
  };

  useEffect(() => {
    if(taskAnalyticsData.length >= 0){
      setLoading(false);
    }
  }, [taskAnalyticsData]);

  const handleClose = () => {
    setAnchorEl(null);
  };

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
<Grid container columnSpacing={3} rowSpacing={2}  mb={1} gap={1}>
      <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      lg={4}
      xl={4}
      spacing={2}
      alignItems="center"
    ><Grid item xs={12} sm={"auto"} md={"auto"} lg={"auto"} xl={"auto"}>      <FormControl  size="small">
            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px",zIndex: 0 }}>
              Project Type {" "}
              {
                <LightTooltip
                  arrow
                  placement="top"
                  title={translate("tooltip.ProjectType")}>
                  <InfoIcon
                    fontSize="medium"
                  />
                </LightTooltip>
              }
            </InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedType}
              label="Project Type"
              sx={{padding:"1px"}}
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
          <Grid item xs={12} sm={"auto"} md={"auto"} lg={"auto"} xl={"auto"}>
            <Box display="flex" alignItems="center" height="100%">
              <Button
                endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained"
                color="primary"
                onClick={() => setShowPicker(!showPicker)}
                sx={{ width: "130px" }}
              >
                Pick Dates
              </Button>
            </Box>
          </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
      <CustomButton
        label="Submit"
        sx={{ width: "35%", height: "40px" }}
        onClick={handleSubmit}
        size="small"
      />

      {/* Download Button */}
      <Box display="flex" alignItems="center" sx={{ width: "45%" }}>
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
                    let start = new Date(workspaceDetails?.created_at);
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
      {taskAnalyticsData.length ?
        taskAnalyticsData.map((analyticsData,_index)=>{
          
          if(analyticsData.length){ 
            return <Grid key={_index} style={{marginTop:"15px"}}>
            <TaskCountAnalyticsChart analyticsData={analyticsData}/>
          </Grid>}
        })
      :''}
      <CustomizedSnackbars
        message={snackbarMessage}
        open={snackbarOpen}
        hide={2000}
        handleClose={closeSnackbar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        variant="error"
      />
    </>
  );
};

export default TaskAnalytics;

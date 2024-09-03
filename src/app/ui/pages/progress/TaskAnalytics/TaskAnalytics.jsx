import { Grid, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import React from "react";
import TaskAnalyticsDataAPI from "@/app/actions/api/Progress/TaskAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import LightTooltip from "@/components/common/Tooltip";
import { translate } from "@/config/localisation";
import InfoIcon from '@mui/icons-material/Info';
import AudioTaskAnalyticsChart from "./AudioTaskAnalyticsChart";
import TaskCountAnalyticsChart from "./TaskCountAnalyticsChart";
import { MenuProps } from "@/utils/utils";
import CustomButton from "@/components/common/Button";
import APITransport from "@/Lib/apiTransport/apitransport";
import { fetchTaskAnalyticsData } from "@/Lib/Features/Analytics/getTaskAnalyticsData";
import CustomizedSnackbars from "@/components/common/Snackbar";

const TaskAnalytics = (props) => {
    /* eslint-disable react-hooks/exhaustive-deps */

  const dispatch = useDispatch();
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("AllTypes");
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const taskAnalyticsData = useSelector(
    (state) => state.getTaskAnalyticsData.data
  );
  const taskAnalyticsData1 = useSelector(
    (state) => console.log(state)
  );
 console.log(taskAnalyticsData);

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

  return (
    <>
      <Grid container columnSpacing={3} rowSpacing={2}  mb={1} gap={3}>
        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
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
        <CustomButton label="Submit" sx={{ width:"120px", mt: 3 }} onClick={handleSubmit}
              disabled={loading} />
      </Grid>
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

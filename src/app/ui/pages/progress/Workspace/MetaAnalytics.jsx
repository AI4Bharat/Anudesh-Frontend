import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CustomButton from "@/components/common/Button";
import { Grid, Select, MenuItem, InputLabel, FormControl} from "@mui/material";
import AudioDurationChart from '../MetaAnalytics/AudioDurationMetaAnalyticsChart';
import Spinner from "@/components/common/Spinner";
import LightTooltip from '@/components/common/Tooltip';
import { translate } from "@/config/localisation";
import InfoIcon from '@mui/icons-material/Info';
import { MenuProps } from "@/utils/utils";
import { fetchMetaAnalyticsData } from '@/Lib/Features/Analytics/getMetaAnalyticsData';
import CustomizedSnackbars from "@/components/common/Snackbar";
import { fetchwsMetaAnalyticsData } from '@/Lib/Features/Analytics/Workspace/wsgetMetaAnalytics';
import WordCountMetaAnalyticsChart from '../MetaAnalytics/WordCountMetaAnalyticsChart';
import SentanceCountMetaAnalyticsChart from '../MetaAnalytics/SentanceCountMetaAnalyticsChart';

export default function MetaAnalytics(props) {
     /* eslint-disable react-hooks/exhaustive-deps */

    const dispatch = useDispatch();
    const {loggedInUserData} = props
    const [loading, setLoading] = useState(false);
    const apiLoading = useSelector((state) => state.apiStatus.loading);
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("AllTypes");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
    const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
    const workspaceDetails = useSelector((state) => state.getWorkspaceDetails.data);

    const metaAnalyticsData = useSelector(
        (state) => state.wsgetMetaAnalytics.data
      );
      const getMetaAnalyticsdata = () => {
        setLoading(true);
        dispatch(fetchwsMetaAnalyticsData({wsID:workspaceDetails?.id,project_type_filter:selectedType}));
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
        getMetaAnalyticsdata();
      }, []);
      const handleSubmit = async () => {
          getMetaAnalyticsdata()
      }

      useEffect(() => {
        if(metaAnalyticsData.length >= 0){
          setLoading(false);

        }
      }, [metaAnalyticsData]);
  return (
    <div>
      <Grid container columnSpacing={3} rowSpacing={2}  mb={1} gap={3}>
        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px", zIndex: 0 }}>
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

      {metaAnalyticsData.length ?
        metaAnalyticsData.map((analyticsData,_index)=>{
          if (analyticsData.length && audioProjectTypes.includes(analyticsData[0].projectType)){
            return (<Grid key={_index} style={{marginTop:"15px"}}>
            <AudioDurationChart analyticsData={analyticsData}/>
            <AudioDurationChart analyticsData={analyticsData} graphCategory='rawAudioDuration'/>
            <WordCountMetaAnalyticsChart analyticsData={analyticsData} graphCategory='audioWordCount'/>
          </Grid>)}
          if(analyticsData.length && 
            (translationProjectTypes.includes(analyticsData[0].projectType) ||
              conversationProjectTypes.includes(analyticsData[0].projectType)
              )
            ){
            return <Grid key={_index} style={{marginTop:"15px"}}>
            <WordCountMetaAnalyticsChart analyticsData={analyticsData}/>
            {analyticsData[0].projectType.includes("Conversation") && <SentanceCountMetaAnalyticsChart analyticsData={analyticsData}/>}
          </Grid>}
          if (analyticsData.length && ocrProjectTypes.includes(analyticsData[0].projectType)){
            return (
            <Grid key={_index} style={{marginTop:"15px"}}>
            <WordCountMetaAnalyticsChart analyticsData={analyticsData} graphCategory='ocrWordCount'/>
          </Grid>
          )
        }
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
    </div>
  )
}

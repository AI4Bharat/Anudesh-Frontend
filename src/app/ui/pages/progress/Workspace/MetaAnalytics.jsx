import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CustomButton from "@/components/common/Button";
import { Grid, Select, MenuItem, InputLabel, FormControl,Box,styled,Menu} from "@mui/material";
import AudioDurationChart from '../MetaAnalytics/AudioDurationMetaAnalyticsChart';
import Spinner from "@/components/common/Spinner";
import LightTooltip from '@/components/common/Tooltip';
import { translate } from "@/config/localisation";
import InfoIcon from '@mui/icons-material/Info';
import { MenuProps } from "@/utils/utils";
import CustomizedSnackbars from "@/components/common/Snackbar";
import { fetchwsMetaAnalyticsData } from '@/Lib/Features/Analytics/Workspace/wsgetMetaAnalytics';
import WordCountMetaAnalyticsChart from '../MetaAnalytics/WordCountMetaAnalyticsChart';
import exportFromJSON from 'export-from-json';
import jsPDF from 'jspdf';
import { KeyboardArrowDown } from "@material-ui/icons";
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
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const metaAnalyticsData = useSelector(
        (state) => state.wsgetMetaAnalytics.data
      );

      const metaAnalyticsDataJson = useSelector((state) => state.wsgetMetaAnalytics.originalData);

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
      const handleClose = () => {
        setAnchorEl(null);
      };
      const downloadCSV = () => {
        if (metaAnalyticsDataJson) {
          const transformedData = Object.keys(metaAnalyticsDataJson).flatMap(projectType => {
            return metaAnalyticsDataJson[projectType].map(data => ({
              projectType,
              language: data.language,
              Ann_Cumulative_sentence_Count: data.annotation_cumulative_sentance_count,
              Rew_Cumulative_sentence_Count: data.review_cumulative_sentance_count,
              Ann_Cumulative_word_Count:data.ann_cumulative_word_count,
              Rew_Cumulative_word_Count:data.rew_cumulative_word_count
            }));
          });
    
          const fileName = 'meta_analytics';
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
      
        metaAnalyticsData.forEach((dataArray, index) => {
          if (dataArray.length) {
            const projectType = dataArray[0].projectType;
            doc.setFontSize(14);
            doc.text(`Project Type: ${projectType}`, 10, yOffset);
            yOffset += 10;
      
            doc.setFontSize(12);
            dataArray.forEach((data, i) => {
              doc.text(`Language: ${data.languages || 'N/A'}`, 10, yOffset);
              doc.text(`Ann Cumulative word Count: ${data.annotation_cumulative_word_count || 'N/A'}`, 10, yOffset + 5);
              doc.text(`Rew Cumulative word Count: ${data.review_cumulative_word_count || 'N/A'}`, 10, yOffset + 10);
              yOffset += 25;
      
              if (yOffset > pageHeight - 30) { 
                doc.addPage();
                yOffset = 10;
              }
            });
      
            yOffset += 10; 
          }
        });
      
        doc.save('meta_analytics.pdf');
      };
      const downloadJSON = () => {
        if (metaAnalyticsDataJson) {
          const transformedData = Object.keys(metaAnalyticsDataJson).flatMap(projectType => {
            return metaAnalyticsDataJson[projectType].map(data => ({
              projectType,
              language: data.language,
              Ann_Cumulative_sentence_Count: data.annotation_cumulative_sentance_count,
              Rew_Cumulative_sentence_Count: data.review_cumulative_sentance_count,
              Ann_Cumulative_word_Count:data.ann_cumulative_word_count,
              Rew_Cumulative_word_Count:data.rew_cumulative_word_count

            }));
          });
    
          const fileName = 'meta_analytics';
          const exportType = exportFromJSON.types.json;
          exportFromJSON({ data: transformedData, fileName, exportType });
        }
      };  const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    
      };


  return (
    <div>
      <Grid container columnSpacing={3} rowSpacing={2}  mb={1} gap={1}>
      <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      lg={4}
      xl={4}
      spacing={1}
      alignItems="center"
    >      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>      <FormControl  size="small">
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
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
          <CustomButton
        label="Submit"
        sx={{ width: "35%", height: "40px" }}
        onClick={handleSubmit}
        size="small"
      />
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

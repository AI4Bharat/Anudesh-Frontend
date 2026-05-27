import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CustomButton from "@/components/common/Button";
import { styled} from "@mui/material";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";

import AudioDurationChart from './AudioDurationMetaAnalyticsChart';
import Spinner from "@/components/common/Spinner";
import LightTooltip from '@/components/common/Tooltip';
import { translate } from "@/config/localisation";
import InfoIcon from '@mui/icons-material/Info';
import { MenuProps } from "@/utils/utils";
import WordCountMetaAnalyticsChart from './WordCountMetaAnalyticsChart';
import { fetchMetaAnalyticsData } from '@/Lib/Features/Analytics/getMetaAnalyticsData';
import CustomizedSnackbars from "@/components/common/Snackbar";
import exportFromJSON from 'export-from-json';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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


export default function MetaAnalytics(props) {
     /* eslint-disable react-hooks/exhaustive-deps */

    const dispatch = useDispatch();
    const {loggedInUserData} = props
    const [loading, setLoading] = useState(false);
    const apiLoading = useSelector((state) => state.apiStatus.loading);
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("AllTypes");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
  const [snackbarMessage, setSnackbarMessage] = useState("");
    const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
    const metaAnalyticsData = useSelector(
        (state) => state.getMetaAnalyticsData.data
      );
      const metaAnalyticsDataJson = useSelector((state) => state.getMetaAnalyticsData.originalData);

      const getMetaAnalyticsdata = () => {
        setLoading(true);
        dispatch(fetchMetaAnalyticsData({OrgId:loggedInUserData?.organization?.id||1,project_type_filter:selectedType}));
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
      {/* ── Controls Card ── */}
      <Box sx={sxCard}>
        <Grid container spacing={2.5} alignItems="center">
          {/* Project Type Dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl size="small" fullWidth>
              <InputLabel id="meta-project-type-label" sx={sxLabel}>
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
                labelId="meta-project-type-label"
                id="meta-project-type-select"
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

          {/* Action Buttons */}
          <Grid item xs={12} sm={6} md={8}>
            <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
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
                  id="meta-download-menu"
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
          </Grid>
        </Grid>
      </Box>


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

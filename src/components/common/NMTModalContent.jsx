"use client";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import "../../IndicTransliterate/index.css"
import configs from "@/config/config";
import GlobalStyles from "@/styles/LayoutStyles";

import {
  Card,
  FormControl,
  FormLabel,
  Select,
  Switch,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Box,
  MenuItem,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { useState } from "react";
import LanguageCode from "@/utils/LanguageCode";
import CustomizedSnackbars from "./Snackbar";

const fetchTranslation = async ({
  sourceLanguage,
  targetLanguage,
  input,
  task,
  serviceId,
  track,
}) => {
  try {
    const response = await axios.post(`https://admin.models.ai4bharat.org/inference/translate`, {
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      input: input,
      task: task,
      serviceId: serviceId,
      track: track,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const NMTModalContent = ({ onClose, services, setIsSpaceClicked, isSpaceClicked }) => {
  const [service, setService] = useState(Object.keys(services)[0] || "");
  
  const getDefaultSourceLanguage = () => {
    const serviceData = services[Object.keys(services)[0]];
    const sourceLanguages = serviceData?.languageFilters?.sourceLanguages || [];
    return sourceLanguages.includes("en") ? "en" : sourceLanguages[0] || "";
  };

  const getDefaultTargetLanguage = () => {
    const serviceData = services[Object.keys(services)[0]];
    const targetLanguages = serviceData?.languageFilters?.targetLanguages || [];
    return targetLanguages[0] || "";
  };

  const [sourceLanguage, setSourceLanguage] = useState(getDefaultSourceLanguage());
  const [targetLanguage, setTargetLanguage] = useState(getDefaultTargetLanguage());
  
  const classes = GlobalStyles();
  const [showSnackBar, setShowSnackBar] = useState({
    message: "",
    variant: "",
    timeout: 1500,
    visible: false,
  });

  const [text, setText] = useState("");
  
  const renderTextarea = (props) => {
    return (
      <textarea
        {...props}
        placeholder={"Enter text here..."}
        rows={3}
        style={{ 
          width: "100%", 
          padding: "12px",
          border: "2px solid #e0e0e0",
          borderRadius: "8px",
          fontSize: "14px",
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none",
          transition: "all 0.3s ease",
          minHeight: "80px",
          backgroundColor: "#fafafa",
          background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
          "&:focus": {
            borderColor: "#ff9800",
            backgroundColor: "#fff",
            boxShadow: "0 0 0 3px rgba(255, 152, 0, 0.15)",
            transform: "translateY(-1px)"
          }
        }}
      />
    );
  };

  const handleSnackBarClose = () => {
    setShowSnackBar({
      message: "",
      variant: "",
      timeout: 1500,
      visible: false,
    });
  };

  const [transliteration, setTransliteration] = useState(true);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tracking, setTracking] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  
  const LANGUAGE_CODE_NAMES = {
    gom: "Konkani",
    mai: "Maithili",
    kn: "Kannada",
    ne: "Nepali",
    ta: "Tamil",
    ks: "Kashmiri",
    pa: "Punjabi",
    sat: "Santali",
    en: "English",
    brx: "Bodo",
    sa: "Sanskrit",
    doi: "Dogri",
    te: "Telugu",
    ur: "Urdu",
    as: "Assamese",
    sd: "Sindhi",
    hi: "Hindi",
    or: "Odia",
    ml: "Malayalam",
    gu: "Gujarati",
    bn: "Bengali",
    mr: "Marathi",
    mni: "Meitei (Manipuri)",
    raj: "Rajasthani",
    si: "Sinhala",
    kok: "Konkani",
  };

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
    setTimeout(() => setAlert({ open: false, message: "", severity: "success" }), 4000);
  };

  const onCopyButtonClick = () => {
    navigator.clipboard.writeText(outputText);
    setShowSnackBar({
      message: "Copied to clipboard!",
      variant: "success",
      timeout: 1500,
      visible: true,
    });
  };

  const handleTranslate = async () => {
    setOutputText("");
    setSuccess(false);

    if (inputText === "") {
      showAlert("Provide text to be translated", "warning");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchTranslation({
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        input: inputText,
        task: "translation",
        serviceId: service,
        track: tracking,
      });

      setIsLoading(false);

      if (response.status === 200) {
        setSuccess(true);
        setOutputText(response.data?.output?.[0]?.target || "");
        showAlert("Translation Successful", "success");
      } else if (response.status === 403) {
        setSuccess(false);
        setOutputText("");
        showAlert("You have reached maximum trials in a minute", "warning");
      } else {
        setSuccess(false);
        setOutputText("");
        showAlert("Service Currently Unavailable, Please Try Again Later", "warning");
      }
    } catch (error) {
      setIsLoading(false);
      setSuccess(false);
      setOutputText("");
      showAlert("Service Currently Unavailable, Please Try Again Later", "error");
    }
  };

  const handleServiceChange = (event) => {
    const newService = event.target.value;
    setService(newService);
    const serviceData = services[newService];
    if (serviceData?.languageFilters) {
      const sourceLanguages = serviceData.languageFilters.sourceLanguages;
      const targetLanguages = serviceData.languageFilters.targetLanguages;
      
      setSourceLanguage(sourceLanguages.includes("en") ? "en" : sourceLanguages[0] || "");
      setTargetLanguage(targetLanguages[0] || "");
    }
  };

  return (
    <Card sx={{ 
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", 
      p: 2, 
      minWidth: "420px",
      maxWidth: "480px",
      maxHeight: "90vh",
      overflow: "auto",
      border: "1px solid #000000ff",
      position: "relative",
      background: "linear-gradient(135deg, #fffaf0 0%, #fff5e6 50%, #fff 100%)",
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        borderRadius: "4px 4px 0 0"
      }
    }}>
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          color: "text.secondary",
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor: "orange.50",
            color: "orange.main",
            transform: "scale(1.1)",
            transition: "all 0.2s ease"
          }
        }}
      >
        <Close />
      </IconButton>

      {/* Header */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          color: "orange.main",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "1.2rem",
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          background: "linear-gradient(135deg, #ff9800, #ffb74d)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}
      >
        Text Translation
      </Typography>

      <FormControl fullWidth>
        <Stack spacing={2}>
          {alert.open && (
            <Alert 
              severity={alert.severity} 
              onClose={() => setAlert({ ...alert, open: false })}
              sx={{ 
                mb: 0, 
                py: 0.5,
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              {alert.message}
            </Alert>
          )}

          <Stack spacing={1.5}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                border: "1px solid #e0e0e0"
              }}
            >
              <FormLabel sx={{ color: "text.secondary", mb: 1, fontWeight: "bold", fontSize: "0.9rem" }}>
                Source Language:
              </FormLabel>
              <Select
                fullWidth
                size="small"
                value={sourceLanguage}
                onChange={(event) => setSourceLanguage(event.target.value)}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0"
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orange.main"
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orange.main",
                    borderWidth: "2px"
                  }
                }}
              >
                {services[service]?.languageFilters?.sourceLanguages?.map((language, index) => (
                  <MenuItem key={index} value={language}>
                    {LANGUAGE_CODE_NAMES[language] || language}
                  </MenuItem>
                )) || <MenuItem value="">No languages available</MenuItem>}
              </Select>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                border: "1px solid #e0e0e0"
              }}
            >
              <FormLabel sx={{ color: "text.secondary", mb: 1, fontWeight: "bold", fontSize: "0.9rem" }}>
                Target Language:
              </FormLabel>
              <Select
                fullWidth
                size="small"
                value={targetLanguage}
                onChange={(event) => setTargetLanguage(event.target.value)}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0"
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orange.main"
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "orange.main",
                    borderWidth: "2px"
                  }
                }}
              >
                {services[service]?.languageFilters?.targetLanguages?.map((language, index) => (
                  <MenuItem key={index} value={language}>
                    {LANGUAGE_CODE_NAMES[language] || language}
                  </MenuItem>
                )) || <MenuItem value="">No languages available</MenuItem>}
              </Select>
            </Box>

            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              p: 2,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
              border: "1px solid #ffcc80",
              boxShadow: "0 2px 8px rgba(255, 152, 0, 0.1)"
            }}>
              <FormLabel sx={{ color: "orange.dark", fontWeight: "bold", fontSize: "0.9rem" }}>
                Enable Transliteration:
              </FormLabel>
              <Switch
                checked={transliteration}
                onChange={() => setTransliteration(!transliteration)}
                color="warning"
                size="small"
              />
            </Box>
          </Stack>

          <Stack spacing={1.5} width="100%">
            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                border: "1px solid #e0e0e0"
              }}
            >
              <FormLabel sx={{ color: "text.secondary", mb: 1, fontWeight: "bold", fontSize: "0.9rem" }}>
                Input Text:
              </FormLabel>
              <IndicTransliterate
                customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                apiKey={`JWT ${localStorage.getItem('anudesh_access_token')}`}
                enabled={sourceLanguage !== "en" && transliteration}
                value={inputText}
                onChangeText={(text) => {
                  setInputText(text);
                }}
                lang={sourceLanguage}
                renderComponent={(props) => renderTextarea(props)}
              />
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                border: "1px solid #e0e0e0"
              }}
            >
              <FormLabel sx={{ color: "text.secondary", mb: 1, fontWeight: "bold", fontSize: "0.9rem" }}>
                Translation:
              </FormLabel>
              <textarea
                value={outputText}
                readOnly
                rows={3}
                placeholder="Translation will appear here..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  backgroundColor: outputText ? "#e8f5e8" : "#fafafa",
                  background: outputText 
                    ? "linear-gradient(135deg, #e8f5e8 0%, #d0f0d0 100%)" 
                    : "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
                  borderColor: outputText ? "#4caf50" : "#e0e0e0",
                  transition: "all 0.3s ease",
                  minHeight: "80px",
                  outline: "none",
                  boxShadow: outputText ? "0 2px 8px rgba(76, 175, 80, 0.1)" : "none"
                }}
              />
            </Box>

            <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mt: 1 }}>
              <Grid item>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={onCopyButtonClick} 
                  disabled={!outputText}
                  sx={{
                    bgcolor: "success.main",
                    fontSize: "0.8rem",
                    px: 2,
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    "&:hover": {
                      bgcolor: "success.dark",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    },
                    "&:disabled": {
                      bgcolor: "grey.400",
                    }
                  }}
                >
                  Copy Text
                </Button>
              </Grid>
              
              <Grid item>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleTranslate}
                    disabled={isLoading || !inputText}
                    sx={{
                      bgcolor: "orange.main",
                      minWidth: "100px",
                      fontSize: "0.8rem",
                      borderRadius: "6px",
                      boxShadow: "0 2px 6px rgba(255, 152, 0, 0.3)",
                      "&:hover": {
                        bgcolor: "orange.dark",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(255, 152, 0, 0.4)"
                      },
                      "&:disabled": {
                        bgcolor: "grey.400",
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Translate"}
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={onClose}
                    sx={{
                      borderColor: "orange.main",
                      color: "orange.main",
                      fontSize: "0.8rem",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      "&:hover": {
                        borderColor: "orange.dark",
                        backgroundColor: "orange.50",
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 6px rgba(255, 152, 0, 0.2)"
                      }
                    }}
                  >
                    Close
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {isLoading && (
              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                py: 1,
                p: 2,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                border: "1px solid #ffcc80"
              }}>
                <CircularProgress size={20} sx={{ color: "orange.main" }} />
                <Typography variant="body2" sx={{ ml: 1, color: "orange.dark", fontSize: "0.8rem", fontWeight: "bold" }}>
                  Translating your text...
                </Typography>
              </Box>
            )}
            
            <CustomizedSnackbars
              hide={showSnackBar.timeout}
              open={showSnackBar.visible}
              handleClose={handleSnackBarClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              variant={showSnackBar.variant}
              message={showSnackBar.message}
            />
          </Stack>
        </Stack>
      </FormControl>
    </Card>
  );
};

export default NMTModalContent;
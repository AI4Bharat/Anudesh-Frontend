"use client";
// import {
//   IndicTransliterate,
// } from "@ai4bharat/indic-transliterate";
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
} from "@mui/material";
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

// const CustomIndicTransliterate = IndicTransliterate;

// Export just the content, not wrapped in Modal
const NMTModalContent = ({ onClose, services, setIsSpaceClicked, isSpaceClicked }) => {
  const [service, setService] = useState(Object.keys(services)[0] || "");
  const [sourceLanguage, setSourceLanguage] = useState(
    services[Object.keys(services)[0]]?.languageFilters?.sourceLanguages[0] || ""
  );
  const [targetLanguage, setTargetLanguage] = useState(
    services[Object.keys(services)[0]]?.languageFilters?.targetLanguages[0] || ""
  );
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
        minRows={3}
        maxRows={6}
        style={{ width: "100%" }}
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
    navigator.clipboard.writeText(inputText);
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
        showAlert("Translation Inference Successful", "success");
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
      setSourceLanguage(serviceData.languageFilters.sourceLanguages[0] || "");
      setTargetLanguage(serviceData.languageFilters.targetLanguages[0] || "");
    }
  };
  console.log(services);

  return (
    <Card sx={{ border: 1, borderColor: "orange.main", boxShadow: 3, p: 3, minWidth: "400px" }}>
      <FormControl fullWidth>
        <Stack spacing={3}>
          {alert.open && (
            <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
              {alert.message}
            </Alert>
          )}

          <Stack spacing={2}>
            {/* <Box>
              <FormLabel sx={{ color: "text.secondary", mb: 1 }}>Select Service:</FormLabel>
              <Select
                fullWidth
                value={service}
                onChange={handleServiceChange}
              >
                {Object.entries(services).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </Box> */}

            <Box>
              <FormLabel sx={{ color: "text.secondary", mb: 1 }}>Select Source Language:</FormLabel>
              <Select
                fullWidth
                value={sourceLanguage}
                onChange={(event) => setSourceLanguage(event.target.value)}
              >
                {services[service]?.languageFilters?.sourceLanguages?.map((language, index) => (
                  <MenuItem key={index} value={language}>
                    {LANGUAGE_CODE_NAMES[language] || language}
                  </MenuItem>
                )) || <MenuItem value="">No languages available</MenuItem>}
              </Select>
            </Box>

            <Box>
              <FormLabel sx={{ color: "text.secondary", mb: 1 }}>Select Target Language:</FormLabel>
              <Select
                fullWidth
                value={targetLanguage}
                onChange={(event) => setTargetLanguage(event.target.value)}
              >
                {services[service]?.languageFilters?.targetLanguages?.map((language, index) => (
                  <MenuItem key={index} value={language}>
                    {LANGUAGE_CODE_NAMES[language] || language}
                  </MenuItem>
                )) || <MenuItem value="">No languages available</MenuItem>}
              </Select>
            </Box>

            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <FormLabel sx={{ color: "text.secondary" }}>Enable Transliteration:</FormLabel>
                <Switch
                  checked={transliteration}
                  onChange={() => setTransliteration(!transliteration)}
                  color="primary"
                />
              </Box>

              {/* <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <FormLabel sx={{ color: "text.secondary" }}>
                  Allow usage analysis:
                </FormLabel>
                <Switch
                  checked={tracking}
                  onChange={(e) => setTracking(e.target.checked)}
                  color="primary"
                />
              </Box> */}
            </Stack>
          </Stack>

          <Stack spacing={2} width="100%">
            <IndicTransliterate
              customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
              // enableASR={true}
              // asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
              apiKey={`JWT ${localStorage.getItem('anudesh_access_token')}`}
              enabled={sourceLanguage !== "en" && transliteration}

              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
              }}
              lang={sourceLanguage}

              renderComponent={(props) => renderTextarea(props)}
            />
            <textarea
              value={outputText}
              readOnly
              minRows={3}
              maxRows={6}
              placeholder="Translation will appear here..."
            />


            <Grid
              container
              direction="row"
              justifyContent="end"
              alignItems="center"
              spacing={1}
            >

              <Button
                variant="contained"
                onClick={handleTranslate}
                disabled={isLoading}
                sx={{
                  mr: 2,
                  bgcolor: "orange.main",
                  "&:hover": {
                    bgcolor: "orange.dark",
                  },
                }}
              >
                Translate
              </Button>
                      <Button variant="contained" sx={{ mr: 2 }} onClick={onCopyButtonClick} disabled={!inputText}>
                        Copy Text
                      </Button>
              
              <Button variant="contained" sx={{}} onClick={onClose}>
                Close
              </Button>

            </Grid>
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress sx={{ color: "orange.main" }} />
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

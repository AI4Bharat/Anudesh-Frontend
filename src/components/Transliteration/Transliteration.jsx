import React, { useEffect, useState ,useRef} from "react";
import { TextField } from "@mui/material";
import { Autocomplete, Box, Button, Card, Grid, Typography } from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import "../../IndicTransliterate/index.css"
import GlobalStyles from "@/styles/LayoutStyles";
import CustomizedSnackbars from "../common/Snackbar";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import configs from "@/config/config";
import { languages } from "./languages";
  /* eslint-disable react-hooks/exhaustive-deps */

const Transliteration = (props) => {
    /* eslint-disable react-hooks/exhaustive-deps */

  const { onCancelTransliteration ,setIsSpaceClicked,isSpaceClicked,setShowTransliterationModel} = props;
  const params = useParams();
  const classes = GlobalStyles();
  const [text, setText] = useState("");
  const languageList = languages;
  const [selectedLang, setSelectedLang] = useState("");
  const [showSnackBar, setShowSnackBar] = useState({
    message: "",
    variant: "",
    timeout: 1500,
    visible: false,
  });
  const matches = useMediaQuery('(max-width:768px)');

  const ProjectDetails = useSelector(state => state.getProjectDetails.data);

  let searchFilters = JSON.parse(localStorage.getItem("TaskData"));

  var data = languageList.filter((e) => e.DisplayName.includes(ProjectDetails.tgt_language));
  useEffect(() => {
    if (params.taskId) {
      setText(searchFilters?.data?.machine_translation);
    } else {
      setText("");
    }
  }, []);

  const renderTextarea = (props) => {
    return (
      <textarea
        {...props}
        placeholder={"Enter text here..."}
        rows={4}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #ffb74d",
          borderRadius: "8px",
          fontSize: "14px",
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none",
          minHeight: "120px",
          backgroundColor: "#fffaf0",
          transition: "all 0.2s ease",
          "&:focus": {
            borderColor: "#ff9800",
            backgroundColor: "#fff",
            boxShadow: "0 0 0 2px rgba(255, 152, 0, 0.2)",
          }
        }}
      />
    );
  };

  const handleLanguageChange = (event, val) => {
    setSelectedLang(val);
  };

  const onCopyButtonClick = () => {
    setIsSpaceClicked(true)
    navigator.clipboard.writeText(text);
    setShowSnackBar({
      message: "Copied to clipboard!",
      variant: "success",
      timeout: 1500,
      visible: true,
    });
  };
  const onCloseButtonClick = async () => {
    setShowTransliterationModel(false);
  };
  const handleSnackBarClose = () => {
    setShowSnackBar({
      message: "",
      variant: "",
      timeout: 1500,
      visible: false,
    });
  };

  return (
    <Card
      sx={{
        width: matches ? window.innerWidth * 0.7 : window.innerWidth * 0.3,
        boxShadow: "0 4px 20px rgba(255, 152, 0, 0.2)",
        borderRadius: "12px",
        overflow: "hidden",
        background: "linear-gradient(135deg, #fffaf0 0%, #fff5e6 100%)",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          background: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
          padding: "0.8rem 1rem",
          marginBottom: 0,
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold", fontSize: "0.9rem" }}>
          Select Language:
        </Typography>
        <Autocomplete
          value={
            selectedLang
              ? selectedLang
              : data.length > 0 && (params.taskId || params.id)
              ? { DisplayName: data[0]?.DisplayName, LangCode: data[0]?.LangCode }
              : { DisplayName: "Hindi - हिंदी", LangCode: "hi" }
          }
          onChange={handleLanguageChange}
          options={languageList}
          size={"small"}
          getOptionLabel={(el) => el.DisplayName}
          sx={{ 
            width: window.innerWidth * 0.15,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              borderRadius: "6px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff9800",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff9800",
                borderWidth: "2px",
              }
            }
          }}
          renderInput={(params) => <TextField {...params} label="" placeholder="Select Language" />}
          disableClearable={true}
        />
      </Grid>

      <Box sx={{ 
        p: 1.5, 
        flex: 1, 
        overflow: "auto",
        minHeight: 0 
      }}>
        <IndicTransliterate
          customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
          apiKey={`JWT ${localStorage.getItem('anudesh_access_token')}`}
          lang={selectedLang.LangCode ? selectedLang.LangCode : (data.length > 0 && (params.taskId || params.id) ? data[0]?.LangCode : "hi")}
          value={text}
          onChangeText={(val) => {
            setText(val);
          }}
          renderComponent={(props) => renderTextarea(props)}
        />
      </Box>

      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ 
          padding: "0.8rem 1rem",
          background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
          borderTop: "1px solid #ffcc80",
          flexShrink: 0,
        }}
        spacing={1}
      >
        <Grid item>
          <Button 
            variant="contained" 
            onClick={onCopyButtonClick} 
            disabled={!text}
            size="small"
            sx={{
              bgcolor: "orange.main",
              fontSize: "0.8rem",
              px: 2,
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(255, 152, 0, 0.3)",
              "&:hover": {
                bgcolor: "orange.dark",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(255, 152, 0, 0.4)",
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
          <Button 
            variant="outlined" 
            onClick={onCloseButtonClick}
            size="small"
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
                boxShadow: "0 2px 4px rgba(255, 152, 0, 0.2)",
              }
            }}
          >
            Close
          </Button>
        </Grid>
        <CustomizedSnackbars
          hide={showSnackBar.timeout}
          open={showSnackBar.visible}
          handleClose={handleSnackBarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          variant={showSnackBar.variant}
          message={showSnackBar.message}
        />
      </Grid>
    </Card>
  );
};

export default Transliteration;
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
        rows={5}
        className={classes.textAreaTransliteration}
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
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "#f5f5f5",
          padding: "0.4rem 1rem 0.4rem 1rem",
          marginBottom: 2,
        }}
      >
        <Typography variant="subtitle1">Select Language:</Typography>
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
          sx={{ width: window.innerWidth * 0.15 }}
          renderInput={(params) => <TextField {...params} label="" placeholder="Select Language" />}
          disableClearable={true}
        />
      </Grid>

      <IndicTransliterate
        customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
        enableASR={true}
        asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
        apiKey={`JWT ${localStorage.getItem('anudesh_access_token')}`}
        lang={selectedLang.LangCode ? selectedLang.LangCode : (data.length > 0 && (params.taskId || params.id) ? data[0]?.LangCode : "hi")}
        value={text}
        onChangeText={(val) => {
          setText(val);
        }}
        renderComponent={(props) => renderTextarea(props)}
      />
      <Grid
        container
        direction="row"
        justifyContent="end"
        alignItems="center"
        sx={{ padding: "1rem" }}
      >
        <Button variant="contained" sx={{ mr: 2 }} onClick={onCopyButtonClick} disabled={!text}>
          Copy Text
        </Button>
        <Button variant="contained" sx={{}} onClick={onCloseButtonClick}>
          Close
        </Button>
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

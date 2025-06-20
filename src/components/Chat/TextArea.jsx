import "./textarea.css";
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Grid } from "@mui/material";
import { translate } from "@/config/localisation";
import IconButton from "@mui/material/IconButton";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import { TextareaAutosize } from "@material-ui/core";
import configs from "@/config/config";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";

const orange = {
  200: "pink",
  400: "#EE6633",
  600: "#EE663366",
};

const grey = {
  50: "#F3F6F9",
  200: "#DAE2ED",
  300: "#C7D0DD",
  700: "#434D5B",
  900: "#1C2025",
};

export default function Textarea({
  handleButtonClick,
  handleOnchange,
  size,
  grid_size,
  class_name,
  loading,
  inputValue,
  defaultLang = null,
  overrideGT = false,
}) {
  /* eslint-disable react-hooks/exhaustive-deps */

  const [text, setText] = useState("");

  const [defLang, setDefLang] = useState(defaultLang);
  const [targetLang, setTargetLang] = useState("");
  const [globalTransliteration, setGlobalTransliteration] = useState(false);
  const [localTransliteration, setLocalTransliteration] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const storedGlobalTransliteration = localStorage.getItem(
        "globalTransliteration",
      );
      const storedLanguage = localStorage.getItem("language");

      if (storedGlobalTransliteration !== null) {
        setGlobalTransliteration(storedGlobalTransliteration === "true");
      }
      if (storedLanguage !== null) {
        setTargetLang(storedLanguage);
      }
    }
  }, [text]);

  useEffect(() => {
    if (text !== "") {
      handleOnchange(text);
    }
  }, [text]);

  useEffect(() => {
    if(overrideGT === true){
      setDefLang("en");
    }
  }, [overrideGT]);

  const handleMouseEnter = (event) => {
    event.target.style.borderColor = orange[400];
  };

  const handleMouseLeave = (event) => {
    event.target.style.borderColor = grey[200];
  };

  const handleFocus = (event) => {
    event.target.style.outline = "0px";
    event.target.style.borderColor = orange[400];
    event.target.style.boxShadow = `0 0 0 3px ${orange[200]}`;
  };

  const handleBlur = (event) => {
    event.target.style.boxShadow = `0px 2px 2px ${grey[50]}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleButtonClick();
      setText("");
    } else if (event.key === "Enter" && event.shiftKey) {
      setText((prevText) => prevText + "\n");
    }
  };
  const textareaStyle = {
    resize: "none",
    fontSize: "1rem",
    width: "60%",
    fontWeight: "400",
    lineHeight: "1.5",
    padding: "12px",
    borderRadius: "12px 12px 0 12px",
    color: grey[900],
    background: "#ffffff",
    border: `1px solid ${grey[200]}`,
    boxShadow: `0px 2px 2px ${grey[50]}`,
    outline: 0,
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const StyledTextarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    resize: none;
    margin-right: 5px;
    font-size: 1rem;
    width: 60%;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };
    &:hover {
      border-color: ${orange[400]};
    }
    &:focus {
      outline: 0;
      border-color: ${orange[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? orange[600] : orange[200]
      };
    }
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

  if (!isMounted) {
    return null;
  }

  return (
    <Grid
      item
      // xs={size}
      backgroundColor="#FFf"
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      position={"fixed"}
      bottom={0}
      width={grid_size}
      className={class_name}
      sx={{ width: "100%" }}
      paddingBottom="8px"
      paddingRight={localTransliteration ? "32px" : "0px"}
      gap={"8px"}
    >
      {overrideGT &&
      <>
      {localTransliteration &&
        <FormControl>
          <InputLabel id="language-select-label">
            Language
          </InputLabel>
          <Select
            label="Language"
            labelId="language-select-label"
            value={defLang}
            onChange={(e) => {
              setDefLang(e.target.value);
            }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="mr">Marathi</MenuItem>
            <MenuItem value="ta">Tamil</MenuItem>
            <MenuItem value="te">Telugu</MenuItem>
            <MenuItem value="kn">Kannada</MenuItem>
            <MenuItem value="gu">Gujarati</MenuItem>
            <MenuItem value="pa">Punjabi</MenuItem>
            <MenuItem value="bn">Bengali</MenuItem>
            <MenuItem value="ml">Malayalam</MenuItem>
            <MenuItem value="as">Assamese</MenuItem>
            <MenuItem value="brx">Bodo</MenuItem>
            <MenuItem value="doi">Dogri</MenuItem>
            <MenuItem value="ks">Kashmiri</MenuItem>
            <MenuItem value="mai">Maithili</MenuItem>
            <MenuItem value="mni">Manipuri</MenuItem>
            <MenuItem value="ne">Nepali</MenuItem>
            <MenuItem value="or">Odia</MenuItem>
            <MenuItem value="sd">Sindhi</MenuItem>
            <MenuItem value="si">Sinhala</MenuItem>
            <MenuItem value="ur">Urdu</MenuItem>
            <MenuItem value="sat">Santali</MenuItem>
            <MenuItem value="sa">Sanskrit</MenuItem>
            <MenuItem value="gom">Goan Konkani</MenuItem>
          </Select>
        </FormControl>
      }
      <Switch
        onClick={() => {
          setLocalTransliteration(!localTransliteration);
        }}
        checked={localTransliteration}
      />
      </>
      }
      {(globalTransliteration || defLang!==null)? (
        <IndicTransliterate
          key={`indic-${defLang || 'default'}-${localTransliteration}`}
          customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
          enableASR={localTransliteration ? true : false}
          asrApiUrl={`${configs.BASE_URL_AUTO}/tasks/asr-api/generic/transcribe`}
          apiKey={`JWT ${localStorage.getItem("anudesh_access_token")}`}
          renderComponent={(props) => (
            <textarea
              // xs={size}
              sx={{
                whiteSpace: "pre-wrap",
              }}
              maxRows={10}
              aria-label="empty textarea"
              placeholder={translate("chat_placeholder")}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
          )}
          value={text}
          onChangeText={(text) => {
            setText(text);
          }}
          onKeyDown={handleKeyDown}
          lang={defLang!==null ? defLang : targetLang}
          style={{
            resize: 'vertical',
            overflow:'auto',
            fontSize: "1rem",
            height: "50%",
            width: "800px",
            height: "50px",
            fontWeight: "400",
            lineHeight: "1.5",
            padding: "12px",
            margin: "16px 0px",
            borderRadius: "12px 12px 0 12px",
            color: grey[900],
            background: "#ffffff",
            border: `1px solid ${grey[200]}`,
            boxShadow: `0px 2px 2px ${grey[50]}`,
          }}
          horizontalView={true}
          enabled={defLang!==null ? defLang === "en" ? false : localTransliteration === false ? false : true : true}
        />
      ) : (
        <TextareaAutosize
          // xs={size}
          maxRows={10}
          aria-label="empty textarea"
          placeholder={translate("chat_placeholder")}
          value={text}
          style={textareaStyle}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          sx={{
            whiteSpace: "pre-wrap",
            width: "100%",
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      <IconButton
        size="large"
        onClick={() => {
          handleButtonClick();
          setText("");
        }}
        disabled={!text?.trim()}
      >
        <SendRoundedIcon style={{ color: "#EE6633", height: "4rem" }} />
      </IconButton>
      {loading && <CircularProgress style={{ color: "#EE6633" }} />}
    </Grid>
  );
}

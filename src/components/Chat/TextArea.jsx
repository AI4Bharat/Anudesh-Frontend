import "./textarea.css";
import { useEffect, useState } from "react";
import { translate } from "@/config/localisation";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Grid } from "@mui/material";
// import {
//   TextareaAutosize as BaseTextareaAutosize,
// } from '@mui/base/TextareaAutosize';
import IconButton from "@mui/material/IconButton";
// import {styled} from '@mui/system';
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import LanguageCode from "@/utils/LanguageCode";
import CircularProgress from "@mui/material/CircularProgress";

const orange = {
  200: "pink",
  400: "#EE6633", //hover-border
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
  language,
  size,
  grid_size,
  class_name,
  loading,
}) {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("en");

  useEffect(() => {
    if (text != "") {
      handleOnchange(text);
    }
  }, [text]);

  useEffect(() => {
    const langs = LanguageCode.languages;
    if (language) {
      const filtereddata = langs.filter((el) => el.label === language);
      setTargetLang(filtereddata[0]?.code);
    }
  }, [language]);

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
    if (event.key === "Enter" && event.ctrlKey) {
      handleButtonClick();
      setText("");
    }
  };

  return (
    <Grid
      item
      xs={size}
      backgroundColor="#FFF"
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      position={"fixed"}
      bottom={0}
      width={grid_size}
      className={class_name}
    >
      <IndicTransliterate
        renderComponent={(props) => (
          <textarea
            xs={size}
            maxRows={10}
            aria-label="empty textarea"
            placeholder={translate('chat_placeholder')}
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
          adjustTextareaHeight();
        }}
        onKeyDown={handleKeyDown}
        lang={targetLang}
        style={{
          resize: "none",
          fontSize: "1rem",
          height: "50%",
          width: "800px",
          height: "50px",
          fontWeight: "400",
          lineHeight: "1.5",
          padding: "12px",
          borderRadius: "12px 12px 0 12px",
          color: grey[900],
          background: "#ffffff",
          border: `1px solid ${grey[200]}`,
          boxShadow: `0px 2px 2px ${grey[50]}`,
        }}
      />
      <IconButton
        size="large"
        onClick={() => {
          handleButtonClick();
          setText("");
        }}
      >
        <SendRoundedIcon style={{ color: "#EE6633", height: "4rem" }} />
      </IconButton>
      {loading && <CircularProgress style={{ color: "#EE6633" }} />}
    </Grid>
  );
}
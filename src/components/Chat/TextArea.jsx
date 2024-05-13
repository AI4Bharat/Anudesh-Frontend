import "./textarea.css";
import { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { Grid } from "@mui/material";
import { translate } from "@/config/localisation";
import IconButton from "@mui/material/IconButton";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";

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
  size,
  grid_size,
  class_name,
  loading,
  prompt,
}) {
  /* eslint-disable react-hooks/exhaustive-deps */

  const [text, setText] = useState("");
  const targetLang = localStorage.getItem("language") || "en";
  const globalTransliteration =
    localStorage.getItem("globalTransliteration") === "true" ? true : false;

  useEffect(() => {
    if (text != "") {
      handleOnchange(text);
    }
  }, [text]);

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
      handleOnchange(text + "\n");
    }
  };

  const Textarea = styled(BaseTextareaAutosize)(
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
      {globalTransliteration ? (
        <IndicTransliterate
          renderComponent={(props) => (
            <textarea
              xs={size}
              sx={{
                whiteSpace: 'pre-wrap',
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
          horizontalView={true}
        />
      ) : (
        <Textarea
          xs={size}
          maxRows={10}
          aria-label="empty textarea"
          placeholder={translate("chat_placeholder")}
          value={prompt}
          onChange={(e) => {
            handleOnchange(e.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleButtonClick();
            } else if (event.key === "Enter" && event.shiftKey) {
              handleOnchange(prompt + "\n");
            }
          }}
          sx={{
            whiteSpace: 'pre-wrap',
          }}
        />
      )}
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

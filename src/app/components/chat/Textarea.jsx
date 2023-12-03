import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { styled } from "@mui/system";

export default function Textarea() {
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

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    font-size: 1rem;
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
    <div
      style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFF",
      padding: "0.5rem",
      position: "fixed",
      // border: "1px solid green",
      bottom: "10px",
      width: "calc(100% - 320px)",
    }}>
      <Textarea
        maxRows={10}
        aria-label="empty textarea"
        placeholder="Chat with Anudesh"
        sx={{
          "resize": "none",
          "marginRight": "5px",
          "width": "40vw",
          "height": "4rem"
        }}
      />
     <IconButton size="large">
        <SendRoundedIcon style={{"color": "#EE6633", "height": "4rem"}}/>
      </IconButton>
    </div>
  );
}
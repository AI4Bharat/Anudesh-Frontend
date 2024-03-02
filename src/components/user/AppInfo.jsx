import { Grid, Typography, Hidden, Box } from "@mui/material";
import "../../styles/Dataset.css";
import Image from "next/image";
import AnudeshLogo from "@/assets/anudesh_logo.png";
export default function AppInfo() {
  /* eslint-disable react-hooks/exhaustive-deps */

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        flexDirection: "column",
      }}
    >
      <Hidden only="xs">
        <Image
          src={AnudeshLogo}
          alt="anudesh-logo"
          style={{
            width: "150px",
            margin: "10% 0px 0% 35px",
            borderRadius: "50%",
          }}
        />
      </Hidden>
      <Typography
        variant={"h2"}
        className="title"
        style={{ margin: "10% 294px 10% 39px" }}
      >
        Anudesh
      </Typography>
      <Hidden only="xs">
        <Typography
          variant={"body1"}
          className="body"
          style={{ marginLeft: "39px" }}
        >
          Anudesh is an open source platform where you can contribute to the
          development of state of the art LLMs for Indian languages by helping
          us create high quality conversational data.
        </Typography>
      </Hidden>
    </Box>
  );
}

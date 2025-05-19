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
        gap: "1rem",
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      {/* <Hidden only="xs"> */}
      <Image
        src={AnudeshLogo}
        alt="https://i.postimg.cc/nz91fDCL/undefined-Imgur.webp"
        style={{
          width: "150px",

          borderRadius: "50%",
        }}
      />
      {/* </Hidden> */}
      <Typography
        variant={"h2"}
        className="title"
        style={{ color: "#fff" }}
        sx={{
          fontSize: {
            xs: "18px", // Font size for small screens
            sm: "22px", // Font size for ≥ 600px
            md: "24px", // Font size for ≥ 900px
            lg: "26px", // Font size for ≥ 1200px
          },
        }}
      >
        Anudesh
      </Typography>
      {/* <Hidden only="xs"> */}
      <Typography
        variant={"body1"}
        className="body"
        style={{}}
        sx={{
          fontSize: {
            xs: "18px", // Font size for small screens
            sm: "22px", // Font size for ≥ 600px
            md: "24px", // Font size for ≥ 900px
            lg: "26px", // Font size for ≥ 1200px
          },
        }}
      >
        Anudesh is an open source platform where you can contribute to the
        development of state of the art LLMs for Indian languages by helping us
        create high quality conversational data.
      </Typography>
      {/* </Hidden> */}
    </Box>
  );
}

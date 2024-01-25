
import { Grid, Typography, Hidden, ThemeProvider } from "@mui/material";
import "../../styles/Dataset.css";
import Image from "next/image";
export default function AppInfo() {
       /* eslint-disable react-hooks/exhaustive-deps */

  return (
    <div>
      <Grid container>
        <Hidden only="xs">
          <Grid item xs={10} sm={10} md={10} lg={10} xl={10}  >
            <Image src={"https://i.imgur.com/56Ut9oz.png"} alt="anudesh-logo" style={{ width: "85px", margin: "10% 0px 0% 35px", borderRadius: "50%" }} />
          </Grid>
        </Hidden>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  >
          <Typography variant={"h2"} className="title" style={{ margin: "10% 294px 10% 39px" }}>Anudesh</Typography>
        </Grid>
        <Hidden only="xs">
          <Typography variant={"body1"} className="body" style={{ margin: "20px 0px 50px 39px", }}>
            Anudesh Information
          </Typography>
        </Hidden>

      </Grid>
    </div>
  )
}

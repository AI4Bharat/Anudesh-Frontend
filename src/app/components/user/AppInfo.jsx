
import { Grid, Typography, Hidden, ThemeProvider } from "@mui/material";
import LoginStyle from "@/styles/loginStyle";

export default function AppInfo() {
  const classes = LoginStyle();
  return (
    <div>
      <Grid container>
        <Hidden only="xs">
          <Grid item xs={10} sm={10} md={10} lg={10} xl={10}  >
            {/* <img src={"Logo.png"} alt="logo" style={{ width: "85px", margin: "10% 0px 0% 35px", borderRadius: "50%" }} /> */}
          </Grid>
        </Hidden>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  >
          <Typography variant={"h2"} className={classes.title} style={{ margin: "10% 294px 10% 39px" }}>Anudesh</Typography>
        </Grid>
        <Hidden only="xs">
          <Typography variant={"body1"} className={classes.body} style={{ margin: "20px 0px 50px 39px", }}>
            Anudesh Information
          </Typography>
        </Hidden>

      </Grid>
    </div>
  )
}

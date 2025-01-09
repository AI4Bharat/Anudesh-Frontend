import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

const CustomCard = ({ title, children, cardContent, cardContentTwo }) => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ width: "50%" }}
    >
      <Card
        elevation={3}
        style={{ border: "none", boxShadow: "none", width: "100%" }}
      >
        <CardContent>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography
              style={{ marginBottom: "15px" }}
              textAlign={"center"}
              variant="h3"
            >
              {title}
            </Typography>
          </Grid>

          {/* <Divider /> */}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ height: "100%" }}
          >
            {cardContent}
          </Grid>
        </CardContent>
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid> */}
      </Card>
      <Card
        elevation={3}
        style={{
          width: "100%",
          boxShadow: "none",
          border: "none",
          padding: "0rem 1rem 0rem 1rem",
        }}
      >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <CardActions style={{ marginBottom: "15px" }}>
            {cardContentTwo}
          </CardActions>
        </Grid>
      </Card>
    </Grid>
  );
};

export default CustomCard;

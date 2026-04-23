import { makeStyles } from "@mui/styles";

const IntroStyle = makeStyles({
  dynamicCardsWrapper: {
    width: "100%",
    height: "auto",
    margin: "auto",
    borderRadius: "12px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
  },
  dynamicContent: {
    fontSize: "13px",
    color: "rgb(75 85 99)",
    textAlign: "left",
    lineHeight: 1.4,
    padding: 0,
  },
  heading: {
    fontSize: "16px",
    color: "#EA5923",
    textTransform: "none",
    marginBottom: "4px",
  }
});

export default IntroStyle;
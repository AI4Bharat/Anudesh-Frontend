import { makeStyles } from "@mui/styles";

const headerStyle = makeStyles((theme) => ({
  parentContainer: {},
  AudioparentContainers: {},
  appBar: {},
  toolbar: {
    width: "80%",
    height: "64px !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between !important",
    boxSizing: "border-box",
    fontFamily: "sans-serif",
    zIndex: 200,
    "@media (min-width: 900px) and (max-width: 1400px)": {
      width: "100%",
    },
  },
  menu: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  headerLogo: {
    height: "40px",
    width: "40px",
    borderRadius: "50%",
  },
  headerTitle: {
    color: theme.palette.mode === "dark" ? "#ffffff" : "#373939",
    display: "inline-block",
    letterSpacing: "1px",
    fontSize: "28px",
    fontWeight: "bold",
    fontDisplay: "swap",
    fontFamily: 'Rowdies,"cursive", Roboto, sans-serif',
    "@media (min-width: 900px) and (max-width: 1400px)": {
      fontSize: "24px !important",
    },
  },
  headerMenu: {
    textDecoration: "none",
    borderRadius: "inherit",
    backgroundColor: "transparent",
    padding: "18px",
    color: theme.palette.mode === "dark" ? "#ffffff" : "black",
    boxShadow: "none",
    fontSize: "18px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    letterSpacing: "0.5px",
    borderRadius: 12,
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#E0E0E0",
      boxShadow: "none",
    },
    "@media (min-width: 900px) and (max-width: 1400px)": {
      fontSize: "14px !important",
      padding: "12px !important",
    },
  },
  highlightedMenu: {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#E0E0E0",
    textDecoration: "none",
    borderRadius: "inherit",
    padding: "18px",
    color: theme.palette.mode === "dark" ? "#ffffff" : "black",
    boxShadow: "none",
    fontSize: "18px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    borderRadius: 12,
    letterSpacing: "0.5px",
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#E0E0E0",
      boxShadow: "none",
    },
    "@media (min-width: 900px) and (max-width: 1400px)": {
      fontSize: "14px !important",
      padding: "12px !important",
    },
  },
  avatar: {
    width: "36px",
    height: "36px",
    backgroundColor: "#e65100 !important",
    fontSize: "14px",
    color: "#FFFFFF !important",
    "@media (max-width:640px)": {
      width: "26px",
      height: "26px",
    },
  },
}));

export default headerStyle;
import { makeStyles } from "@mui/styles";

const headerStyle = makeStyles({
  parentContainer: {
    // no styles for now
  },
  AudioparentContainers: {
    // no styles for now
  },
  appBar: {
    // no styles for now
  },
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
    color: "#373939",
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
  backgroundColor: "transparent",
  padding: "18px",
  color: "var(--nav-text-color, black)",
  boxShadow: "none",
  fontSize: "18px",
  fontFamily: "Roboto, sans-serif",
  fontWeight: 600,
  letterSpacing: "0.5px",
  borderRadius: 12,
  transition: "background-color 0.2s ease, color 0.2s ease",
  "&:hover": {
    backgroundColor: "var(--nav-hover-bg, #E0E0E0)",
    boxShadow: "none",
  },
  "@media (min-width: 900px) and (max-width: 1400px)": {
    fontSize: "14px !important",
    padding: "12px !important",
  },
},
highlightedMenu: {
  backgroundColor: "var(--nav-active-bg, #E0E0E0)",
  textDecoration: "none",
  padding: "18px",
  color: "var(--nav-active-color, black)",
  boxShadow: "none",
  fontSize: "18px",
  fontFamily: "Roboto, sans-serif",
  fontWeight: 600,
  borderRadius: 12,
  letterSpacing: "0.5px",
  transition: "background-color 0.2s ease, color 0.2s ease",
  "&:hover": {
    backgroundColor: "var(--nav-active-hover-bg, #E0E0E0)",
    boxShadow: "none",
  },
  "@media (min-width: 900px) and (max-width: 1400px)": {
    fontSize: "14px !important",
    padding: "12px !important",
  },
},
});

export default headerStyle;

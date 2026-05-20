import { makeStyles } from "@mui/styles";
// #EE6633

const DatasetStyle = makeStyles({
  Projectsettingtextarea: {
    width: "100%",
    fontSize: "1.4rem",
    fontFamily: "Roboto",
    fontWeight: 10,
    lineHeight: 1.2,
  },
  custombtn: {
    borderRadius: 0,
  },
  workspaceTables: {
    marginTop: "20px",
  },
  projectButton: {
    width: "100%",
    textDecoration: "none",
  },
  annotatorsButton: {
    width: "100%",
  },
  managersButton: {
    width: "100%",
  },
  settingsButton: {
    width: "100%",
    color: "#ee6633",
  },
  workspaceCard: {
    width: "100%",
    minHeight: "420px",
    padding: "40px",
  },
  projectsettingGrid: {
    margin: "20px 0px 10px 0px",
  },
  filterToolbarContainer: {
    // alignItems : 'center',
    // display : 'inline',
    // textAlign : "end"
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: "10px",
  },

  clearAllBtn: {
    float: "right",
    margin: "9px 16px 0px auto",
    padding: "0",
    height: "15px",
  },
  filterContainer: {
    borderBottom: "1px solid #00000029",
    padding: "18px",
    // marginTop: "20px",
    // width: "400px",
    maxHeight: "400px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    "@media (max-width:550px)": {
      // width: "200px",
      maxHeight: "170px",
    },
  },
  statusFilterContainer: {
    // display : 'contents',
    alignItems: "center",
  },
  filterTypo: {
    // marginBottom: "9px",
    // marginRight : "20px"
  },
  applyBtn: {
    float: "right",
    borderRadius: "20px",
    margin: "9px 16px 9px auto",
    width: "80px",
  },
  clrBtn: {
    float: "right",
    borderRadius: "20px",
    margin: "9px 10px 9px auto",
    width: "100px",
  },
  menuStyle: {
    padding: "0px",
    justifyContent: "left",
    fontSize: "1.125rem",
    fontWeight: "500 !important",

    "&:hover": {
      backgroundColor: "white",
    },
    borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
    // borderTop:"3px solid green",
    "& svg": {
      marginLeft: "auto",
      color: "rgba(0, 0, 0, 0.42)",
    },
  },
  projectCardContainer: {
    cursor: "pointer",
  },
  modelname: {
    boxSizing: "border-box",
    // marginTop: "15px",
    height: "64px",
    backgroundColor: "white",
    maxWidth: "90%",
    minWidth: "90%",
    width: "auto",
    display: "flex",
    alignItems: "center",
    padding: "0 15px",
    borderRadius: "12px",
  },
  parentContainer: {
    minHeight: "100vh",
    // direction: "row",
    alignItems: "center",
    paddingBottom: "5vh",
    // justifyContent: "space-around",
    flexGrow: 0,
  },
  projectCardContainer1: {
    backgroundColor: "#EE6633",
    height: "100%",
    width: "100%",
  },
  projectCardContainer2: {
    backgroundColor: "#66bb6a",
    height: "100%",
    width: "100%",
  },
  userCardContainer: {
    direction: "column",
    alignItems: "center",
    height: "100%",
    placeContent: "center",
  },
  dashboardContentContainer: {
    alignItems: "left",
    justifyContent: "space-around",
    minHeight: "70vh",
    borderLeft: "1px solid lightgray",
    paddingLeft: "5%",
  },
  link: {
    textDecoration: "none",
  },
  progress: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  progressDiv: {
    position: "fixed",
    // backgroundColor: 'rgba(0.5, 0, 0, 0.5)',
    zIndex: 1000,
    // width: '100%',
    // height: '100%',
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 1,
    pointerEvents: "none",
  },
  search: {
    //position: "relative",
    borderRadius: "24px",
    backgroundColor: "#F3F3F3",
    marginLeft: "0px",
    width: "300px",
    //textAlign: "left",
    //justifyContent:"center"
    //float: "right",
    marginBottom: "10px",
    //   position: "absolute",
    //  Right: "200px",
    //  top:"155px",
  },
  searchIcon: {
    // padding: theme.spacing(0, 2),
    // height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#00000029",
    marginLeft: "10px",
    marginTop: "10px",
  },
  divider: {
    borderLeft: "1px solid #E0E0E0",
    height: "200px",
    position: "absolute",
  },
  rootdiv: {
    marginTop: "25px",
  },
  ToolbarContainer: {
    position: "absolute",
    bottom: "14px",
    right: "45px",
  },
  TotalSummarydata: {
    padding: "4px 0px 0px 4px",
  },
  projectgrid: {
    textAlign: "start",
  },
  // fixedWidthContainer: {
  // 	maxWidth: "5%",
  // },
  root: {
    minHeight: 40,
    alignItems: "center",
  },
  modelValue: {
    fontSize: "14px",
    fontFamily: "Roboto",
    fontWeight: 400,
    lineHeight: "22px",
    "&:first-letter": { textTransform: "capitalize" },
    display: "-webkit-box",
    "-webkit-line-clamp": "2",
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    "@media (max-width:400px)": {
      marginLeft: "-14px",
      fontSize: "12px",
    },
  },
  descCardIcon: {
    display: "flex",
    borderRadius: "20%",
    padding: "15px",
    height: "fit-content",
  },
  formControl: {
    width: 300,
  },
  AddGlossaryCard: {
    width: "100%",
    minHeight: "420px",
    padding: "20px 40px 20px 40px",
    justifyContent: "center",
    justifyItems: "center",
  },
  SuggestAnEditCard: {
    width: "100%",
    minHeight: "350px",
    padding: "20px 40px 20px 40px",
    justifyContent: "center",
    justifyItems: "center",
  },

  heading: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#1a1a2e",
    fontSize: "1.375rem",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  topBar: {
    display: "flex",
    alignItems: "stretch",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    fontSize: "14px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },

  topBarInnerBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    padding: "16px 12px",
    position: "relative",
    transition: "background-color 0.2s ease",
    "&:not(:last-child)::after": {
      content: '""',
      position: "absolute",
      right: 0,
      top: "20%",
      height: "60%",
      width: "1px",
      background: "#e2e8f0",
    },
    "&:hover": {
      backgroundColor: "rgba(249, 115, 22, 0.04)",
    },
  },
  toolTip: {
    width: "220px",
    minHeight: "120px",
    height: "auto",
    fontSize: "13px",
    backgroundColor: "#ffffff",
    color: "#1a1a2e",
    padding: "14px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
    fontFamily: "'Roboto', sans-serif",
    lineHeight: 1.6,
  },

  toolTips: {
    width: "260px",
    minHeight: "160px",
    height: "auto",
    fontSize: "13px",
    backgroundColor: "#ffffff",
    color: "#1a1a2e",
    padding: "14px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
    fontFamily: "'Roboto', sans-serif",
    lineHeight: 1.6,
  },

  textTransliteration: {
    borderRadius: "3px",

    height: "60px",
    padding: "15px 10px 10px 10px",
    resize: "none",
    margin: "7px 0px 0px 0px",
    width: "200px",
    fontSize: "16px",
  },
});

export default DatasetStyle;

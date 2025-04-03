import { makeStyles } from "@mui/styles";

const ModelResponseEvaluationStyle = makeStyles({
  outputWrpr: {
    "@media (max-width: 425px)": {
      flexDirection: "column", // Stacks children vertically on smaller screens
    },
  },
  yesText: {
    marginRight: "1rem",
  },
  numBtn: {
    backgroundColor: "white !important",
    color: "#6C5F5B !important",
    fontWeight: "bold !important",
  },
  accordion: {
    borderRadius: "12rem",
  },
  selected: {
    backgroundColor: "#EE6633 !important",
    color: "white !important",
  },
  container: {
    display: "flex",
    // backgroundColor: "#F6F6F6",
    marginBottom: "30px",
  },

  leftPanel: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "#F6F6F6",
    width: "100%",
  },

  rightPanel: {
    // backgroundColor: "#F6F6F6",
    flex: "1",
    width: "100%",
    // maxHeight: '1000vh',
    height: "auto",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    scrollBehavior: "smooth",
  },

  orangeRadio: {
    "& .MuiSvgIcon-root": {
      color: "#9a9a9a", // Color of the circle when unchecked
    },
    "&.Mui-checked .MuiSvgIcon-root": {
      color: "#EE6633", // Color of the checked circle
    },
    "&.Mui-checked .MuiSvgIcon-root::before": {
      background: "#EE6633", // Color of the dot when checked
    },
  },

  promptContainer: {
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#6C5F5B",
    width: "100%",
  },
  outputContainer: {
    marginBottom: "1rem",
    color: "#6C5F5B",
  },
  inputQuestion: {
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#6C5F5B",
  },
  heading: {
    fontWeight: "bold",
    // marginBottom: "1rem",
    color: "#6C5F5B",
  },
  ratingButton: {
    marginRight: "1rem",
    marginLeft: "1rem",
    marginBottom: "2rem",
  },

  hr: {
    border: "1px solid #d8d8d8",
    marginBottom: "1rem",
  },
  questionContainer: {
    display: "flex",
    justifyContent: "center",
  },
  questionText: {
    width: "80%",
    color: "#393939",
  },
  radioGroupContainer: {
    width: "20%",
    marginLeft: "0.5rem",
    marginBottom: "0.5rem",
    display: "flex",
  },
  notesContainer: {
    fontWeight: "bold",
    marginTop: "1rem",
    color: "#6C5F5B",
    maxHeight: "5rem",
  },
  notesTextarea: {
    width: "100%",
    marginTop: "1.2rem",
    border: "2px solid #6C5F5B",
    borderRadius: "2px",
    padding: "5px",
  },

  interactionWindow: {
    width: "100%",
    padding: "0rem 1rem 1rem 1rem",
    color: "#6C5F5B",
    // borderRadius: "2rem 0px 0px 1rem",
    flexDirection: "row",
    // marginTop:"1.5rem"
  },

  answerTile: {
    overflowWrap: "anywhere",
  },
  accordion: {
    marginBottom: "1rem",
  },
});

export default ModelResponseEvaluationStyle;

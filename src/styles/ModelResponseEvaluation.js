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
    marginBottom: "30px",
  },

  leftPanel: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  rightPanel: {
    flex: "1",
    height: "auto",
    overflowY: "scroll",
    overflowX: "hidden",
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
  },
  outputContainer: {
    marginBottom: "1rem",
    color: "#6C5F5B",
  },
  inputQuestion: {
    fontWeight: "bold",
    color: "#6C5F5B",
  },
  heading: {
    fontWeight: "bold",
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
    marginTop: "1.2rem",
    border: "2px solid #6C5F5B",
    borderRadius: "2px",
    padding: "5px",
  },

  interactionWindow: {
    padding: "0rem 1rem 1rem 1rem",
    color: "#6C5F5B",
    flexDirection: "row",
  },

  answerTile: {
    overflowWrap: "anywhere",
  },
  accordion: {
    marginBottom: "1rem",
  },
});

export default ModelResponseEvaluationStyle;

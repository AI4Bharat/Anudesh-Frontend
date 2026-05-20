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
    backgroundColor: "var(--surface) !important",      
    color: "var(--model-muted) !important",             
    fontWeight: "bold !important",
  },
  accordion: {
    borderRadius: "12rem",
  },
  selected: {
    backgroundColor: "var(--brand-primary) !important",
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
      color: "var(--text-disabled)", // Color of the circle when unchecked
    },
    "&.Mui-checked .MuiSvgIcon-root": {
       color: "var(--brand-primary)", // Color of the checked circle
    },
    "&.Mui-checked .MuiSvgIcon-root::before": {
      background: "var(--brand-primary)", // Color of the dot when checked
    },
  },

  promptContainer: {
    marginBottom: "1rem",
    color: "var(--model-muted)",
  },
  outputContainer: {
    marginBottom: "1rem",
    color: "var(--model-muted)",
  },
  inputQuestion: {
    fontWeight: "bold",
    color: "var(--model-muted)",
  },
  heading: {
    fontWeight: "bold",
    color: "var(--model-muted)",
  },
  ratingButton: {
    marginRight: "1rem",
    marginLeft: "1rem",
    marginBottom: "2rem",
  },

  hr: {
    border: "1px solid var(--border-color)",
    margin: "1rem 0",
  },
  questionContainer: {
    display: "flex",
    justifyContent: "center",
  },
  questionText: {
    width: "80%",
    color: "var(--text-primary)",
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
    color: "var(--model-muted)", 
    maxHeight: "5rem",
  },
  notesTextarea: {
    marginTop: "1.2rem",
    border: "2px solid var(--model-muted)",
    borderRadius: "2px",
    padding: "5px",
  },

  interactionWindow: {
    padding: "0rem 1rem 1rem 1rem",
    color: "var(--model-muted)",
    flexDirection: "row",
  },

  answerTile: {
    overflowWrap: "anywhere",
  }
});

export default ModelResponseEvaluationStyle;

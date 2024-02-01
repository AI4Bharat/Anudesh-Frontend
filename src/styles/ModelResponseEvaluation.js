
import { makeStyles } from '@mui/styles';

const ModelResponseEvaluationStyle = makeStyles({
  whiteBtn: {
    backgroundColor: "white",
    border: "none",
    color: "rgb(44, 39, 153)",
    padding: "10px 25px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "20px 2px",
    transitionDuration: "0.4s",
    cursor: "pointer",
    borderRadius: "10px",
    height: "auto",
    "&:hover": {
      boxShadow:
        "0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)",
      textDecoration: "none",
      backgroundColor: "white",
      fontFamily: "'Open Sans', sans-serif",
    },
  },

  blueBtn: {
    backgroundColor: "rgb(44, 39, 153)",
    border: "none",
    fontFamily: "'Open Sans', sans-serif",
    color: "white",
    padding: "10px 25px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "20px 2px",
    transitionDuration: "0.4s",
    cursor: "pointer",
    borderRadius: "10px",
    height: "auto",
    "&:hover": {
      boxShadow:
        "0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)",
      textDecoration: "none",
      backgroundColor: "rgb(44, 39, 153)",
    },
  },

  topBar: {
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "'Open Sans', sans-serif",
    width: "100%",
  },

  numBtn: {
    backgroundColor: "white",
    border: "none",
    color: "rgb(44, 39, 153)",
    padding: "10px 25px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "0px",
    transitionDuration: "0.4s",
    cursor: "pointer",
    borderRadius: "10px",
    height: "auto",
    "&:hover": {
      boxShadow:
        "0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)",
      textDecoration: "none",
      backgroundColor: "white",
      fontFamily: "'Open Sans', sans-serif",
    },
  },
  selected: {
    backgroundColor: "rgb(44, 39, 153)",
    color: "white",
    fontFamily: "'Open Sans', sans-serif",
  },
  container: {
    fontFamily: "'Open Sans', sans-serif",
    width: "100vw",
    height: "100vh",
    display: "flex",
    overflow: "hidden",
  },
  leftPanel: {
   
    flex: "0 0 30%", // Adjust the width as needed
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflowY: "auto",
  },
  rightPanel: {
    backgroundColor: "white",
    flex: "1",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    // Enable vertical scrolling
    scrollBehavior: "smooth", // Enable smooth scrolling
  },
  promptContainer: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    fontFamily: "'Open Sans', sans-serif",
  },
  outputContainer: {
    fontSize: "2rem",
    marginBottom: "1rem",
    fontFamily: "'Open Sans', sans-serif",
  },
  ratingText: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    fontFamily: "'Open Sans', sans-serif",
  },
  ratingButton: {
    marginRight: "1rem",
    marginLeft: "1rem",
    marginBottom: "2rem",
    fontFamily: "'Open Sans', sans-serif",
  },
  hr: {
    border: "1px solid black",
    marginBottom: "1rem",
  },
  questionContainer: {
    display: "flex",
    justifyContent: "center",
  },
  questionText: {
    width: "80%",
    fontSize: "18px",
  },
  radioGroupContainer: {
    width: "20%",
    marginLeft: "0.5rem",
    marginBottom: "0.5rem",
    fontSize: "1.5rem",
  },
  notesContainer: {
    fontWeight: "bold",
    fontSize: "2rem",
    marginTop: "1rem",
  },
  notesTextarea: {
    width: "100%",
    marginTop: "1.2rem",
    border: "1px solid #ccc",
    borderRadius: "2px",
    padding: "5px",
  },
  interactionWindow: {
    maxHeight: "100%",
    width: "100%",
    padding: "2rem",
    overflowY: "auto",
    border: "1px solid rgb(44, 39, 153)",
    
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "1rem",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "white",
      borderRadius: "1rem",
      border: "1px solid rgb(44, 39, 153)",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgb(44, 39, 153)",
      border: "1px solid rgb(44, 39, 153)",
      borderRadius: "1rem",
    },
  },
  promptTile: {
    border: "1px solid white",
    color: "white",
    padding: "1rem",
    maxWidth: "70%",
    borderRadius: "1rem",
    fontSize: "1.2rem",
    backgroundColor: "rgb(44, 39, 153)",
    float: "right",
    marginBottom: "2rem",
    fontFamily: "'Open Sans', sans-serif",
  },
  answerTile: {
    border: "1px solid rgb(44, 39, 153)",
    color: "rgb(44, 39, 153)",
    padding: "1rem",
    maxWidth: "70%",
    borderRadius: "1rem",
    fontSize: "1.2rem",
    float: "left",
    marginBottom: "2rem",
    fontFamily: "'Open Sans', sans-serif",
  },
});

export default ModelResponseEvaluationStyle



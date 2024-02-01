
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
    },
  },

  blueBtn: {
    backgroundColor: "rgb(44, 39, 153)",
    border: "none",
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
    paddingLeft: "1rem",
    paddingRight: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    position: 'fixed',
  },
  ratingBtns: {
    display: 'flex',

  },
  ratingBtn: {
    backgroundColor: 'transparent',
    border: '2px solid orange',
    margin: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    outline: 'none',
    transition: 'color 0.3s, background-color 0.3s',
  },
  selected: {
    backgroundColor: 'orange',
    color: 'red',
    border: '2px solid orange',
  },
  container: {
    width: '100vw',
    height: '90vh',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  panel: {
    width: '50%',
    height: '100vh',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '@media (max-width: 984px)': {
      width: '100%',
    },
  },
  rightPanelPadding: {
    padding: '2rem',
  },
  promptContainer: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    overflowWrap: 'anywhere'

  },
  outputContainer: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    overflowWrap: 'anywhere',
    color: '#8e9aaf'
  },
  showMoreLink: {
    cursor: 'pointer',
    color: 'blue',
    textDecoration: 'none',
    marginLeft: '8px',
    fontSize: '1.3rem',
  },
  showMoreLinkCard: {
    cursor: 'pointer',
    color: 'blue',
    textDecoration: 'none',
    marginLeft: '8px',
    fontSize: '1.3rem',
    float: 'right',
    width: '100%',
    marginTop:'1rem'
  },
  ratingText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.2rem',
  },
  ratingButton: {
    marginRight: '1rem',
    marginLeft: '1rem',
    marginBottom: '2rem',
  },
  hr: {
    border: '1px solid black',
    marginBottom: '1rem',
  },
  questionContainer: {
    display: 'flex',
    // justifyContent: 'center',
    '@media (max-width: 595px)': {
      flexDirection: 'column'
    },
  },
  questionText: {
    width: '80%',
    fontSize: '1.5rem',
  },
  radioGroupContainer: {
    width: '20%',
    marginLeft: '0.5rem',
    marginBottom: '0.5rem',
    fontSize: '1.5rem',
  },
  notesContainer: {
    fontWeight: 'bold',
    fontSize: '2rem',
    marginTop: '1rem',
  },
  notesTextarea: {
    width: '100%',
    marginTop: '1.2rem',
    border: '1px solid #ccc',
    borderRadius: '2px',
    padding: '5px',
  },
  interactionWindow: {
    height: '90%',
    width: '100%',
    padding: '2rem',
    overflow: 'auto',
  },
  promptOutputPair: {
    width: '70%',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    backgroundColor: '#ffffff',
    boxShadow: '10px 10px 20px #c9c9c9, -10px -10px 20px #ffffff',
    transition: 'box-shadow 0.3s ease', // Adding a transition for a smoother effect
    '&:hover': {
      boxShadow: '15px 15px 30px #c9c9c9, -15px -15px 30px #ffffff', // Adjust the box-shadow values for the hover effect
    },
  },
  left: {
    float: 'left',
  },
  right: {
    float: 'right'
  },
  tile: {
    borderRadius: '1rem',
    fontSize: '1.2rem',
    overflowWrap: 'anywhere'
  },
  promptTile: {
    fontWeight: 'bold'
  },
  outputTile: {
    marginBottom: '0.5rem',
    color: '#8e9aaf',

  }
})

export default ModelResponseEvaluationStyle



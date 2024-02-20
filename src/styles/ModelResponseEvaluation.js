import {makeStyles} from '@mui/styles';

const ModelResponseEvaluationStyle = makeStyles ({
  yesText: {
    marginRight: '1rem',
  },
  numBtn: {
    backgroundColor: 'white',
    border: 'none',
    width: '2px',
    padding: '2px 25px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '0px',
    transitionDuration: '0.4s',
    cursor: 'pointer',
    borderRadius: '10px',
    height: 'auto',
    color: '#6C5F5B',
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: '#2c2799',
      color: 'white',
    },
  },
  accordion: {
    borderRadius: '12rem',
  },
  selected: {
    backgroundColor: 'rgb(44, 39, 153)',
    color: 'white',
  },
  container: {
    display: 'flex',
  },

  leftPanel: {
    flex: '0 0 30%', // Adjust the width as needed
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'auto', // Enable vertical scrolling
    backgroundColor: '#f0f4f9',
  },
  rightPanel: {
    backgroundColor: 'white',
    flex: '1',
    maxHeight: '100vh', // Set maximum height to 100% of viewport height
    overflowY: 'auto', // Enable vertical scrolling if needed
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    scrollBehavior: 'smooth',
  },

  orangeRadio: {
    '& .MuiSvgIcon-root': {
      color: '#9a9a9a', // Color of the circle when unchecked
    },
    '&.Mui-checked .MuiSvgIcon-root': {
      color: '#EE6633', // Color of the checked circle
    },
    '&.Mui-checked .MuiSvgIcon-root::before': {
      background: '#EE6633', // Color of the dot when checked
    },
  },

  promptContainer: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#6C5F5B',
    borderRadius: '1rem',
  },
  outputContainer: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#6C5F5B',
  },
  ratingText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#6C5F5B',
  },
  ratingButton: {
    marginRight: '1rem',
    marginLeft: '1rem',
    marginBottom: '2rem',
  },
  hr: {
    border: '1px solid #d8d8d8',
    marginBottom: '1rem',
  },
  questionContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  questionText: {
    width: '80%',
    fontSize: '18px',
    color: '#393939',
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
    color: '#6C5F5B',
  },
  notesTextarea: {
    width: '100%',
    marginTop: '1.2rem',
    border: '2px solid #6C5F5B',
    borderRadius: '2px',
    padding: '5px',
  },

  interactionWindow: {
    maxHeight: '100%',
    height: '100vh',
    width: '100%',
    padding: '2rem',
    overflowY: 'auto',
    color: '#6C5F5B',
    borderRadius: '2rem 0px 0px 1rem',
  },
  promptTile: {
    marginBottom: '1rem',
  },
  answerTile: {
    overflowWrap: 'anywhere',
  },
  accordion: {
    marginBottom: '1rem',
  },
});

export default ModelResponseEvaluationStyle;

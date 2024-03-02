import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import '../../styles/Dataset.css';

function CircularIndeterminate(props) {
  return (
    <div className="progressDiv">
      <CircularProgress color="primary" size={50} className="progress" />
    </div>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default CircularIndeterminate;
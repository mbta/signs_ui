import React from 'react';
import PropTypes from 'prop-types';
import Line from './Line';

function Viewer({ signs, currentTime, line }) {
  return (
    <div>
      <Line
        signs={signs}
        currentTime={currentTime}
        line={line}
      />
    </div>
  );
}

Viewer.propTypes = {
  signs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string, duration: PropTypes.string,
  }))).isRequired,
  currentTime: PropTypes.number.isRequired,
};

export default Viewer;

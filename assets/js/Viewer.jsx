import React from 'react';
import PropTypes from 'prop-types';
import Line from './Line';

function Viewer({ signs, currentTime, line, enabledSigns, setEnabled }) {
  return (
    <div>
      <Line
        signs={signs}
        currentTime={currentTime}
        line={line}
        enabledSigns={enabledSigns}
        setEnabled={setEnabled}
      />
    </div>
  );
}

Viewer.propTypes = {
  signs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string, duration: PropTypes.string,
  }))).isRequired,
  currentTime: PropTypes.number.isRequired,
  line: PropTypes.string.isRequired,
  enabledSigns: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  setEnabled: PropTypes.func.isRequired,
};

export default Viewer;

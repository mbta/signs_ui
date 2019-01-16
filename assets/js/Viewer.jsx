import React from 'react';
import PropTypes from 'prop-types';
import Line from './Line';

function Viewer({
  signs, currentTime, line, signConfigs, setConfigs,
}) {
  return (
    <div>
      <Line
        signs={signs}
        currentTime={currentTime}
        line={line}
        signConfigs={signConfigs}
        setConfigs={setConfigs}
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
  signConfigs: PropTypes.object.isRequired,
  setConfigs: PropTypes.func.isRequired,
};

export default Viewer;

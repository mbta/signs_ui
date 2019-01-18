import React from 'react';
import PropTypes from 'prop-types';
import Line from './Line';
import { signConfigType } from './types';

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
  signConfigs: PropTypes.objectOf(signConfigType).isRequired,
  setConfigs: PropTypes.func.isRequired,
};

export default Viewer;

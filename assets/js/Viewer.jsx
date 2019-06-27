import React from 'react';
import PropTypes from 'prop-types';
import Line from './Line';
import { signConfigType, signContentType } from './types';

function Viewer({
  signs, currentTime, line, signConfigs, setConfigs, readOnly,
}) {
  return (
    <div>
      <Line
        signs={signs}
        currentTime={currentTime}
        line={line}
        signConfigs={signConfigs}
        setConfigs={setConfigs}
        readOnly={readOnly}
      />
    </div>
  );
}

Viewer.propTypes = {
  signs: PropTypes.objectOf(signContentType).isRequired,
  currentTime: PropTypes.number.isRequired,
  line: PropTypes.string.isRequired,
  signConfigs: PropTypes.objectOf(signConfigType).isRequired,
  setConfigs: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Viewer;

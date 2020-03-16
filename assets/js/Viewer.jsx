import React from 'react';
import PropTypes from 'prop-types';
import Line from './Line';
import { signConfigType, signContentType, multiSignHeadwayConfigType } from './types';

function Viewer({
  signs,
  currentTime,
  line,
  signConfigs,
  setConfigs,
  readOnly,
  multiSignHeadwayConfigs,
  setMultiSignHeadwayConfigs,
  unsetMultiSignHeadwayConfigs,
}) {
  return (
    <div>
      <Line
        signs={signs}
        currentTime={currentTime}
        line={line}
        multiSignHeadwayConfigs={multiSignHeadwayConfigs}
        signConfigs={signConfigs}
        setConfigs={setConfigs}
        setMultiSignHeadwayConfigs={setMultiSignHeadwayConfigs}
        unsetMultiSignHeadwayConfigs={unsetMultiSignHeadwayConfigs}
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
  multiSignHeadwayConfigs: PropTypes.objectOf(multiSignHeadwayConfigType).isRequired,
  setConfigs: PropTypes.func.isRequired,
  setMultiSignHeadwayConfigs: PropTypes.func.isRequired,
  unsetMultiSignHeadwayConfigs: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Viewer;

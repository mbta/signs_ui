import React from 'react';
import PropTypes from 'prop-types';
import Line from './Line';
import { signConfigType, signContentType, configuredHeadwayType } from './types';

function Viewer({
  signs,
  currentTime,
  line,
  signConfigs,
  setConfigs,
  readOnly,
  configuredHeadways,
  setConfiguredHeadways,
}) {
  return (
    <div>
      <Line
        signs={signs}
        currentTime={currentTime}
        line={line}
        configuredHeadways={configuredHeadways}
        signConfigs={signConfigs}
        setConfigs={setConfigs}
        setConfiguredHeadways={setConfiguredHeadways}
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
  configuredHeadways: PropTypes.objectOf(configuredHeadwayType).isRequired,
  setConfigs: PropTypes.func.isRequired,
  setConfiguredHeadways: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Viewer;

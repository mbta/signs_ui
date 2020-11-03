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
  chelseaBridgeAnnouncements,
  setChelseaBridgeAnnouncements,
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
        chelseaBridgeAnnouncements={chelseaBridgeAnnouncements}
        setChelseaBridgeAnnouncements={setChelseaBridgeAnnouncements}
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
  chelseaBridgeAnnouncements: PropTypes.oneOf(['auto', 'off']).isRequired,
  configuredHeadways: PropTypes.objectOf(configuredHeadwayType).isRequired,
  setConfigs: PropTypes.func.isRequired,
  setConfiguredHeadways: PropTypes.func.isRequired,
  setChelseaBridgeAnnouncements: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Viewer;

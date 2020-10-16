import React from 'react';
import PropTypes from 'prop-types';
import Sign from './Sign';
import { arincToRealtimeId } from './mbta';
import { signConfigType, signContentType } from './types';

function zoneDescription(stationConfig, zone) {
  if (stationConfig.zones[zone].value !== true) {
    return stationConfig.zones[zone].value;
  }

  const zones = {
    n: 'NB',
    s: 'SB',
    e: 'EB',
    w: 'WB',
    m: 'MZ',
    c: 'CP',
  };
  return zones[zone];
}

function makeSign(
  config,
  zone,
  signs,
  currentTime,
  line,
  signConfigs,
  setConfigs,
  readOnly,
) {
  if (config.zones[zone].value) {
    const key = `${config.id}-${zone}`;
    const signContent = signs[key] || { sign_id: key, lines: {} };
    const realtimeId = arincToRealtimeId(key, line);
    const signConfig = signConfigs[realtimeId] || { mode: 'off' };
    const modes = (config.zones[zone] && config.zones[zone].modes) || {
      auto: true,
      headway: true,
      custom: true,
      off: true,
    };
    return (
      <Sign
        key={key}
        modes={modes}
        signId={zoneDescription(config, zone)}
        line={line}
        signContent={signContent}
        currentTime={currentTime}
        signConfig={signConfig}
        setConfigs={setConfigs}
        realtimeId={realtimeId}
        readOnly={readOnly}
      />
    );
  }

  return null;
}

function Station({
  config,
  signs,
  currentTime,
  line,
  signConfigs,
  setConfigs,
  readOnly,
}) {
  return (
    <div key={config.id}>
      <h3>
        {config.name}
        {' '}
        <small>
          (
          {config.id}
          )
        </small>
      </h3>
      <div className="row">
        <div className="col">
          {makeSign(
            config,
            's',
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            readOnly,
          )}
          {makeSign(
            config,
            'w',
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            readOnly,
          )}
        </div>
        <div className="col">
          {makeSign(
            config,
            'c',
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            readOnly,
          )}
          {makeSign(
            config,
            'm',
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            readOnly,
          )}
        </div>
        <div className="col">
          {makeSign(
            config,
            'n',
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            readOnly,
          )}
          {makeSign(
            config,
            'e',
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            readOnly,
          )}
        </div>
      </div>
      <hr />
    </div>
  );
}

const zoneConfig = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  modes: PropTypes.shape({
    auto: PropTypes.bool,
    custom: PropTypes.bool,
    headway: PropTypes.bool,
    off: PropTypes.bool,
  }),
});

Station.propTypes = {
  config: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    zones: PropTypes.shape({
      n: zoneConfig,
      e: zoneConfig,
      s: zoneConfig,
      w: zoneConfig,
      c: zoneConfig,
      m: zoneConfig,
    }).isRequired,
  }).isRequired,
  signs: PropTypes.objectOf(signContentType).isRequired,
  currentTime: PropTypes.number.isRequired,
  line: PropTypes.string.isRequired,
  signConfigs: PropTypes.objectOf(signConfigType).isRequired,
  setConfigs: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Station;

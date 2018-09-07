import React from 'react';
import PropTypes from 'prop-types';
import Sign from './Sign';
import { arincToRealtimeId } from './mbta';

function zoneDescription(stationConfig, zone) {
  if (stationConfig.zones[zone] !== true) {
    return stationConfig.zones[zone];
  }

  const zones = {
    n: 'NB', s: 'SB', e: 'EB', w: 'WB', m: 'MZ', c: 'CN',
  };
  return zones[zone];
}

function makeSign(config, zone, signs, currentTime, line, enabledSigns, setEnabled) {
  if (config.zones[zone]) {
    const key = `${config.id}-${zone}`;
    const lines = signs[key];
    let lineOne;
    let lineTwo;
    let lineOneDuration;
    let lineTwoDuration;
    if (lines !== undefined) {
      lineOne = lines[0].text;
      lineTwo = lines[1].text;
      lineOneDuration = lines[0].duration;
      lineTwoDuration = lines[1].duration;
    } else {
      lineOne = '';
      lineTwo = '';
      lineOneDuration = '0';
      lineTwoDuration = '0';
    }

    const realtimeId = arincToRealtimeId(key, line);
    const isEnabled = enabledSigns[realtimeId] || false;

    return (
      <Sign
        key={key}
        signId={zoneDescription(config, zone)}
        line={line}
        lineOne={lineOne}
        lineOneDuration={lineOneDuration}
        lineTwo={lineTwo}
        lineTwoDuration={lineTwoDuration}
        currentTime={currentTime}
        isEnabled={isEnabled}
        setEnabled={setEnabled}
        realtimeId={realtimeId}
      />
    );
  }

  return null;
}

function Station({
  config, signs, currentTime, line, enabledSigns, setEnabled
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
          {makeSign(config, 's', signs, currentTime, line, enabledSigns, setEnabled)}
          {makeSign(config, 'w', signs, currentTime, line, enabledSigns, setEnabled)}
        </div>
        <div className="col">
          {makeSign(config, 'c', signs, currentTime, line, enabledSigns, setEnabled)}
          {makeSign(config, 'm', signs, currentTime, line, enabledSigns, setEnabled)}
        </div>
        <div className="col">
          {makeSign(config, 'n', signs, currentTime, line, enabledSigns, setEnabled)}
          {makeSign(config, 'e', signs, currentTime, line, enabledSigns, setEnabled)}
        </div>
      </div>
      <hr />
    </div>
  );
}

Station.propTypes = {
  config: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    zones: PropTypes.shape({
      n: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      e: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      s: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      w: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      c: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      m: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    }).isRequired,
  }).isRequired,
  signs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string, duration: PropTypes.string,
  }))).isRequired,
  currentTime: PropTypes.number.isRequired,
  line: PropTypes.string.isRequired,
  enabledSigns: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  setEnabled: PropTypes.func.isRequired,
};

export default Station;

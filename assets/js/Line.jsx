import React from 'react';
import PropTypes from 'prop-types';
import Station from './Station';
import { stationConfig, arincToRealtimeId } from './mbta';
import { signConfigType, signContentType } from './types';

function name(line) {
  if (line === 'Red') { return 'Red Line'; }
  if (line === 'Blue') { return 'Blue Line'; }
  if (line === 'Orange') { return 'Orange Line'; }
  if (line === 'Green') { return 'Green Line'; }
  if (line === 'Mattapan') { return 'Mattapan'; }
  if (line === 'SL3') { return 'SL3'; }

  return '';
}

function setEnabledStations(setConfigFn, stations, line, enabled) {
  const statuses = {};

  stations.forEach((station) => {
    ['n', 's', 'e', 'w', 'm', 'c'].forEach((zone) => {
      const realtimeId = arincToRealtimeId(`${station.id}-${zone}`, line);
      if (realtimeId) {
        if (enabled) {
          statuses[realtimeId] = { mode: 'auto' };
        } else {
          statuses[realtimeId] = { mode: 'off', expires: null };
        }
      }
    });
  });

  setConfigFn(statuses);
}

function Line({
  signs, currentTime, line, signConfigs, setConfigs, readOnly,
}) {
  const stations = stationConfig[line] || [];

  return (
    <div>
      <h1>
        {name(line)}
      </h1>

      {!readOnly
        && (
          <div className="viewer--toggle-all">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { setEnabledStations(setConfigs, stations, line, true); }}
            >
              Enable all
            </button>

            &nbsp;

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { setEnabledStations(setConfigs, stations, line, false); }}
            >
              Disable all
            </button>
          </div>
        )
      }
      {
        stations.map(station => (
          <Station
            key={station.id}
            config={station}
            signs={signs}
            currentTime={currentTime}
            line={line}
            signConfigs={signConfigs}
            setConfigs={setConfigs}
            readOnly={readOnly}
          />
        ))
      }
    </div>
  );
}

Line.propTypes = {
  signs: PropTypes.objectOf(signContentType).isRequired,
  currentTime: PropTypes.number.isRequired,
  line: PropTypes.string.isRequired,
  signConfigs: PropTypes.objectOf(signConfigType).isRequired,
  setConfigs: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Line;

import React from 'react';
import PropTypes from 'prop-types';
import ConfiguredHeadwaysForm from './ConfiguredHeadwaysForm';
import Station from './Station';
import { stationConfig, arincToRealtimeId, branchConfig } from './mbta';
import { signConfigType, signContentType, configuredHeadwayType } from './types';

function name(line) {
  if (line === 'Red') { return 'Red Line'; }
  if (line === 'Blue') { return 'Blue Line'; }
  if (line === 'Orange') { return 'Orange Line'; }
  if (line === 'Green') { return 'Green Line'; }
  if (line === 'Mattapan') { return 'Mattapan'; }
  if (line === 'SL3') { return 'SL3'; }

  return '';
}

function setAllStationsMode(setConfigFn, stations, line, mode) {
  const statuses = {};

  stations.forEach((station) => {
    ['n', 's', 'e', 'w', 'm', 'c'].forEach((zone) => {
      const realtimeId = arincToRealtimeId(`${station.id}-${zone}`, line);
      if (realtimeId) {
        if (mode === 'auto') {
          statuses[realtimeId] = { mode: 'auto' };
        } else if (mode === 'off' || mode === 'headway') {
          statuses[realtimeId] = { mode, expires: null };
        }
      }
    });
  });

  setConfigFn(statuses);
}

function Line({
  signs,
  currentTime,
  line,
  signConfigs,
  setConfigs,
  readOnly,
  configuredHeadways,
  setConfiguredHeadways,
}) {
  const stations = stationConfig[line] || [];
  const branches = branchConfig[line] || [];

  return (
    <div>
      <h1>
        {name(line)}
      </h1>
      {branches.length > 0 && (
        <ConfiguredHeadwaysForm
          branches={branches}
          configuredHeadways={configuredHeadways}
          setConfiguredHeadways={setConfiguredHeadways}
          readOnly={readOnly}
        />
      )}
      {!readOnly
        && (
          <div className="viewer--toggle-all">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { setAllStationsMode(setConfigs, stations, line, 'auto'); }}
            >
              Set all to auto
            </button>

            &nbsp;

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { setAllStationsMode(setConfigs, stations, line, 'headway'); }}
            >
              Set all to headway
            </button>

            &nbsp;

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { setAllStationsMode(setConfigs, stations, line, 'off'); }}
            >
              Turn off all
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
  configuredHeadways: PropTypes.objectOf(configuredHeadwayType).isRequired,
  setConfigs: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  setConfiguredHeadways: PropTypes.func.isRequired,
};

export default Line;

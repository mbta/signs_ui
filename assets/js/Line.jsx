import React from 'react';
import PropTypes from 'prop-types';
import ConfiguredHeadwaysForm from './ConfiguredHeadwaysForm';
import Station from './Station';
import { stationConfig, arincToRealtimeId, branchConfig } from './mbta';
import {
  signConfigType,
  signContentType,
  configuredHeadwayType,
} from './types';

function name(line) {
  if (line === 'Red') {
    return 'Red Line';
  }
  if (line === 'Blue') {
    return 'Blue Line';
  }
  if (line === 'Orange') {
    return 'Orange Line';
  }
  if (line === 'Green') {
    return 'Green Line';
  }
  if (line === 'Mattapan') {
    return 'Mattapan';
  }
  if (line === 'Silver') {
    return 'Silver Line';
  }
  if (line === 'Busway') {
    return 'Busways';
  }

  return '';
}

function setAllStationsMode(setConfigFn, stations, line, mode) {
  const statuses = {};

  stations.forEach((station) => {
    ['n', 's', 'e', 'w', 'm', 'c'].forEach((zone) => {
      const realtimeId = arincToRealtimeId(`${station.id}-${zone}`, line);
      const { modes } = station.zones[zone];
      if (realtimeId) {
        if (mode === 'auto' && modes.auto) {
          statuses[realtimeId] = { mode: 'auto' };
        } else if ((mode === 'off' || mode === 'headway') && modes[mode]) {
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
  chelseaBridgeAnnouncements,
  setChelseaBridgeAnnouncements,
  stationConfigs,
}) {
  const stations = stationConfigs || (stationConfig[line] && stationConfig[line].stations) || [];
  const batchModes = (stationConfig[line] && stationConfig[line].batchModes) || {};
  const branches = branchConfig[line] || [];
  const batchMode = React.useMemo(() => {
    const uniqueModes = {};
    const isMixed = stations.some((station) => Object.keys(station.zones).some((zone) => {
      if (station.zones[zone] && station.zones[zone].value) {
        const realtimeId = arincToRealtimeId(`${station.id}-${zone}`, line);
        const mode = signConfigs[realtimeId] && signConfigs[realtimeId].mode;
        if (mode) {
          uniqueModes[mode] = mode;
        }
        return Object.keys(uniqueModes).length > 1;
      }
      return false;
    }));
    return isMixed ? 'mixed' : Object.keys(uniqueModes)[0];
  }, [signConfigs, stations, arincToRealtimeId]);
  return (
    <div>
      <h1>{name(line)}</h1>
      {branches.length > 0 && (
        <ConfiguredHeadwaysForm
          branches={branches}
          configuredHeadways={configuredHeadways}
          setConfiguredHeadways={setConfiguredHeadways}
          readOnly={readOnly}
        />
      )}
      {line === 'Silver' && (
        <div>
          <label>
            Bridge Announcements
            <div className="switch">
              <input
                name="chelsea_boarding"
                type="checkbox"
                className="switch-input"
                checked={chelseaBridgeAnnouncements === 'auto'}
                onChange={(e) => {
                  setChelseaBridgeAnnouncements(e.target.checked ? 'auto' : 'off');
                }}
              />
              <span className="switch-label">Switch</span>
            </div>
          </label>
        </div>
      )}
      {!readOnly && (
        <div className="viewer--toggle-all">
          {batchModes.auto && (
            <label
              className={`btn ${batchMode === 'auto' ? 'active' : ''}`}
              htmlFor="auto"
            >
              All to auto
              <input
                className="sr-only"
                type="radio"
                id="auto"
                value="auto"
                checked={batchMode === 'auto'}
                onChange={() => {
                  setAllStationsMode(setConfigs, stations, line, 'auto');
                }}
              />
            </label>
          )}
          {batchModes.headway && (
            <label
              className={`btn ${batchMode === 'headway' ? 'active' : ''}`}
              htmlFor="headway"
            >
              All to headway
              <input
                className="sr-only"
                type="radio"
                id="headway"
                value="headway"
                checked={batchMode === 'headway'}
                onChange={() => {
                  setAllStationsMode(setConfigs, stations, line, 'headway');
                }}
              />
            </label>
          )}
          {batchModes.off && (
            <label
              className={`btn ${batchMode === 'off' ? 'active' : ''}`}
              htmlFor="off"
            >
              All to off
              <input
                className="sr-only"
                type="radio"
                id="off"
                value="off"
                checked={batchMode === 'off'}
                onChange={() => {
                  setAllStationsMode(setConfigs, stations, line, 'off');
                }}
              />
            </label>
          )}
          {batchMode === 'mixed' && (
            <label
              className={`btn ${batchMode === 'mixed' ? 'active' : ''}`}
              htmlFor="mixed"
            >
              Mixed
              <input
                className="sr-only"
                id="mixed"
                type="radio"
                value="mixed"
                checked
                readOnly
              />
            </label>
          )}
        </div>
      )}
      {stations.map((station) => (
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
      ))}
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
  chelseaBridgeAnnouncements: PropTypes.oneOf(['auto', 'off']).isRequired,
  setChelseaBridgeAnnouncements: PropTypes.func.isRequired,
  stationConfigs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    zones: PropTypes.objectOf(PropTypes.shape({
      [PropTypes.string]: PropTypes.shape({
        auto: PropTypes.bool,
        off: PropTypes.bool,
        custom: PropTypes.bool,
        headway: PropTypes.bool,
      }),
    })),
  })),
};

Line.defaultProps = {
  stationConfigs: null,
};

export default Line;

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
  const batchMode = React.useMemo(() => {
    const uniqueModes = {};
    const isMixed = stations.some(station => Object.keys(station.zones).some((zone) => {
      if (station.zones[zone]) {
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
            <label className={`btn ${batchMode === 'auto' ? 'active' : ''}`} htmlFor="auto">
              All to auto
              <input className="sr-only" type="radio" id="auto" value="auto" checked={batchMode === 'auto'} onChange={() => { setAllStationsMode(setConfigs, stations, line, 'auto'); }} />
            </label>
            <label className={`btn ${batchMode === 'headway' ? 'active' : ''}`} htmlFor="headway">
              All to headway
              <input className="sr-only" type="radio" id="headway" value="headway" checked={batchMode === 'headway'} onChange={() => { setAllStationsMode(setConfigs, stations, line, 'headway'); }} />
            </label>
            <label className={`btn ${batchMode === 'off' ? 'active' : ''}`} htmlFor="off">
              All to off
              <input className="sr-only" type="radio" id="off" value="off" checked={batchMode === 'off'} onChange={() => { setAllStationsMode(setConfigs, stations, line, 'off'); }} />
            </label>
            {batchMode === 'mixed' && (
              <label className={`btn ${batchMode === 'mixed' ? 'active' : ''}`} htmlFor="mixed">
                Mixed
                <input className="sr-only" id="mixed" type="radio" value="mixed" checked readOnly />
              </label>
            )}
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

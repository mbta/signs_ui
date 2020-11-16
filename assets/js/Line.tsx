import * as React from 'react';
import ConfiguredHeadwaysForm from './ConfiguredHeadwaysForm';
import Station from './Station';
import { stationConfig, arincToRealtimeId, branchConfig } from './mbta';
import {
  SignContent,
  ConfiguredHeadways,
  SignConfigs,
  StationConfig,
} from './types';

function name(line: string) {
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

function setAllStationsMode(
  setConfigFn: (x: SignConfigs) => void,
  stations: StationConfig[],
  line: string,
  mode: string,
) {
  const statuses: {[key: string]: {mode: 'auto' | 'off' | 'headway', expires?: null}} = {};

  stations.forEach((station: StationConfig) => {
    ['n', 's', 'e', 'w', 'm', 'c'].forEach((zone) => {
      const realtimeId = arincToRealtimeId(`${station.id}-${zone}`, line);
      const zoneConfig = station.zones[zone];
      if (zoneConfig !== undefined) {
        const { modes } = zoneConfig;
        if (realtimeId) {
          if (mode === 'auto' && modes.auto) {
            statuses[realtimeId] = { mode: 'auto' };
          } else if ((mode === 'off' || mode === 'headway') && modes[mode]) {
            statuses[realtimeId] = { mode, expires: null };
          }
        }
      }
    });
  });

  setConfigFn(statuses);
}

interface LineProps {
  signs: SignContent;
  currentTime: number;
  line: string;
  signConfigs: SignConfigs;
  configuredHeadways: ConfiguredHeadways;
  setConfigs: (x: SignConfigs) => void;
  readOnly: boolean;
  setConfiguredHeadways: (x: ConfiguredHeadways) => void;
  stationConfigs?: StationConfig[];
  chelseaBridgeAnnouncements: 'auto' | 'off'
  setChelseaBridgeAnnouncements: (x: 'auto' | 'off') => void
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
}: LineProps): JSX.Element {
  const stations: StationConfig[] = stationConfigs
    || (stationConfig[line] && stationConfig[line].stations)
    || [];
  const batchModes = (stationConfig[line] && stationConfig[line].batchModes) || {};
  const branches = branchConfig[line] || [];
  const batchMode = React.useMemo(() => {
    const uniqueModes: {[key: string]: string} = {};
    const isMixed = stations.some((station) => Object.keys(station.zones).some((zone) => {
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
      <label className="mt-1 mb-4">
        Chelsea Drawbridge Announcements
        <div className="switch">
          <input
            name="chelsea_bridge"
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
      {stations.map((station: StationConfig) => (
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

Line.defaultProps = {
  stationConfigs: undefined,
};

export default Line;

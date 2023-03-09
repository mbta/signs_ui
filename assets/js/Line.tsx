import * as React from 'react';
import Collapse, { Panel } from 'rc-collapse';
import Tabs, { TabPane } from 'rc-tabs';
import ConfiguredHeadwaysForm from './ConfiguredHeadwaysForm';
import Station from './Station';
import { stationConfig, branchConfig } from './mbta';
import SignGroups from './SignGroups';
import ModalPrompt from './ModalPrompt';
import {
  ConfiguredHeadways,
  RouteAlerts,
  RouteSignGroups,
  RouteSignGroupsWithDeletions,
  SignConfigs,
  SignContent,
  StationConfig,
} from './types';
import { arincToRealtimeId } from './helpers';

/* eslint-disable camelcase */

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
  const statuses: {
    [key: string]: { mode: 'auto' | 'off' | 'headway'; expires?: null };
  } = {};

  stations.forEach((station: StationConfig) => {
    ['n', 's', 'e', 'w', 'm', 'c'].forEach((zone) => {
      const realtimeId = arincToRealtimeId(`${station.id}-${zone}`);
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
  alerts: RouteAlerts;
  signs: SignContent;
  currentTime: number;
  line: string;
  signConfigs: SignConfigs;
  configuredHeadways: ConfiguredHeadways;
  setConfigs: (x: SignConfigs) => void;
  readOnly: boolean;
  setConfiguredHeadways: (x: ConfiguredHeadways) => void;
  stationConfigs?: StationConfig[];
  chelseaBridgeAnnouncements: 'auto' | 'off';
  setChelseaBridgeAnnouncements: (x: 'auto' | 'off') => void;
  signGroups: RouteSignGroups;
  setSignGroups: (
    line: string,
    signGroups: RouteSignGroupsWithDeletions,
  ) => void;
}

function Line({
  alerts,
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
  signGroups,
  setSignGroups,
}: LineProps): JSX.Element {
  const branches = branchConfig[line] || [];

  const stations: StationConfig[] =
    stationConfigs ||
    (stationConfig[line] && stationConfig[line].stations) ||
    [];

  const signsToGroups: { [id: string]: string } = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(signGroups).flatMap(([groupKey, { sign_ids }]) =>
          sign_ids.map((id) => [id, groupKey]),
        ),
      ),
    [signGroups],
  );

  const ungroupSign = React.useCallback(
    (realtimeId: string) => {
      const groupKey = signsToGroups[realtimeId];
      const { sign_ids: signIds, ...signGroup } = signGroups[groupKey];

      setSignGroups(line, {
        [groupKey]: {
          ...signGroup,
          sign_ids: signIds.filter((id) => id !== realtimeId),
        },
      });
    },
    [line, signGroups, signsToGroups, setSignGroups],
  );

  const batchModes =
    (stationConfig[line] && stationConfig[line].batchModes) || {};

  const batchMode = React.useMemo(() => {
    const uniqueModes: { [key: string]: string } = {};
    const isMixed = stations.some((station) =>
      Object.keys(station.zones).some((zone) => {
        if (station.zones[zone]) {
          const realtimeId = arincToRealtimeId(`${station.id}-${zone}`);
          const mode = signConfigs[realtimeId] && signConfigs[realtimeId].mode;
          if (mode) {
            uniqueModes[mode] = mode;
          }
          return Object.keys(uniqueModes).length > 1;
        }
        return false;
      }),
    );

    return isMixed ? 'mixed' : Object.keys(uniqueModes)[0];
  }, [signConfigs, stations, arincToRealtimeId]);

  const [promptChangeAllMode, setPromptChangeAllMode] = React.useState<
    string | null
  >(null);

  const promptText = (
    <div>
      <p>
        <strong>There are active sign groups at this time.</strong>
      </p>
      <p>
        Setting all signs to &ldquo;{promptChangeAllMode}&rdquo; will ungroup
        those signs and set them to &ldquo;{promptChangeAllMode}&rdquo;.
      </p>
      <p>
        Would you like to set all the signs on this line to &ldquo;
        {promptChangeAllMode}&rdquo;?
      </p>
    </div>
  );

  const modalAccept = React.useCallback(() => {
    if (promptChangeAllMode) {
      const signGroupDeletions: RouteSignGroupsWithDeletions = {};
      Object.keys(signGroups).forEach((groupKey) => {
        signGroupDeletions[groupKey] = {};
      });
      setSignGroups(line, signGroupDeletions);
      setAllStationsMode(setConfigs, stations, line, promptChangeAllMode);
    }

    setPromptChangeAllMode(null);
  }, [
    promptChangeAllMode,
    signGroups,
    setAllStationsMode,
    setConfigs,
    stations,
    line,
    setPromptChangeAllMode,
  ]);

  const modalCancel = React.useCallback(
    () => setPromptChangeAllMode(null),
    [setPromptChangeAllMode],
  );

  const setAllMode = (mode: string) => {
    if (Object.keys(signGroups).length > 0) {
      setPromptChangeAllMode(mode);
    } else {
      setAllStationsMode(setConfigs, stations, line, mode);
    }
  };

  return (
    <div>
      {promptChangeAllMode && (
        <ModalPrompt
          contents={promptText}
          acceptText={`Yes, set all signs to "${promptChangeAllMode}"`}
          onAccept={modalAccept}
          onCancel={modalCancel}
        />
      )}
      <h1>{name(line)}</h1>
      <Collapse destroyInactivePanel>
        <Panel header="Bulk Editing">
          <Tabs defaultActiveKey="0" tabBarStyle={{}} id="tab-panel-container">
            <TabPane tab="Sign Groups">
              <SignGroups
                line={line}
                currentTime={currentTime}
                alerts={alerts}
                signGroups={signGroups}
                setSignGroups={setSignGroups}
                readOnly={readOnly}
              />
            </TabPane>
            {branches.length > 0 && (
              <TabPane tab="Set Headways" key="1">
                <ConfiguredHeadwaysForm
                  branches={branches}
                  configuredHeadways={configuredHeadways}
                  setConfiguredHeadways={setConfiguredHeadways}
                  readOnly={readOnly}
                />
              </TabPane>
            )}
          </Tabs>
        </Panel>
      </Collapse>

      {line === 'Silver' && (
        <label className="mt-1 mb-4">
          Chelsea Drawbridge Announcements:
          {readOnly && (
            <em>
              <span className="ml-3">
                {chelseaBridgeAnnouncements === 'auto' ? 'Auto' : 'Off'}
              </span>
            </em>
          )}
          {!readOnly && (
            <div className="toggle_switch--container">
              <input
                name="chelsea_bridge"
                aria-label="Chelsea Drawbridge Announcements"
                type="checkbox"
                className="toggle_switch--input"
                checked={chelseaBridgeAnnouncements === 'auto'}
                onChange={(e) => {
                  setChelseaBridgeAnnouncements(
                    e.target.checked ? 'auto' : 'off',
                  );
                }}
              />
              <span className="toggle_switch--label" />
            </div>
          )}
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
                onChange={() => setAllMode('auto')}
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
                onChange={() => setAllMode('headway')}
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
                onChange={() => setAllMode('off')}
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
          alerts={alerts}
          config={station}
          signs={signs}
          currentTime={currentTime}
          line={line}
          signConfigs={signConfigs}
          setConfigs={setConfigs}
          signGroups={signGroups}
          signsToGroups={signsToGroups}
          ungroupSign={ungroupSign}
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

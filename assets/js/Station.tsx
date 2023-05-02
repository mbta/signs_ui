import * as React from 'react';
import SignPanel from './SignPanel';
import {
  RouteAlerts,
  RouteSignGroups,
  SignConfig,
  SignConfigs,
  SignContent,
  SingleSignContent,
  StationConfig,
  Zone,
} from './types';
import { defaultZoneLabel, arincToRealtimeId, getSignConfig } from './helpers';

/* eslint-disable camelcase */

function zoneDescription(stationConfig: StationConfig, zone: Zone) {
  const zoneConfig = stationConfig.zones[zone];

  if (zoneConfig === undefined) {
    return '';
  }

  if (zoneConfig.label) {
    return zoneConfig.label;
  }

  return defaultZoneLabel(zone);
}

function makeSign(
  alerts: RouteAlerts,
  config: StationConfig,
  zone: Zone,
  signs: {
    [x: string]:
      | SingleSignContent
      | {
          sign_id: string;
          lines: {
            [key: string]: {
              text: {
                content: string;
                duration: number;
              }[];
              expiration: string;
            };
          };
        };
  },
  currentTime: number,
  line: string,
  signConfigs: { [x: string]: SignConfig },
  setConfigs: (x: SignConfigs) => void,
  signGroups: RouteSignGroups,
  signsToGroups: { [id: string]: string },
  ungroupSign: (id: string) => void,
  readOnly: boolean,
) {
  const zoneConfig = config.zones[zone];
  if (zone && zoneConfig) {
    const key = `${config.id}-${zone}`;
    const signContent = signs[key] || { sign_id: key, lines: {} };
    const realtimeId = arincToRealtimeId(key);
    const signConfig = getSignConfig(signConfigs, config.id, zone);
    const signGroupKey = signsToGroups[realtimeId];
    const signGroup = signGroupKey ? signGroups[signGroupKey] : undefined;
    const ungroupMe = signGroupKey ? () => ungroupSign(realtimeId) : undefined;

    const setConfig = (conf: SignConfig) => {
      setConfigs({ [realtimeId]: conf });
    };

    return (
      <SignPanel
        alerts={alerts}
        key={key}
        modes={zoneConfig.modes}
        signId={zoneDescription(config, zone)}
        line={line}
        signContent={signContent}
        currentTime={currentTime}
        signConfig={signConfig}
        setConfig={setConfig}
        realtimeId={realtimeId}
        signGroup={signGroup}
        ungroupSign={ungroupMe}
        readOnly={readOnly}
      />
    );
  }

  return null;
}

interface StationProps {
  alerts: RouteAlerts;
  config: StationConfig;
  signs: SignContent;
  currentTime: number;
  line: string;
  signConfigs: SignConfigs;
  setConfigs: (x: SignConfigs) => void;
  signGroups: RouteSignGroups;
  signsToGroups: { [id: string]: string };
  ungroupSign: (id: string) => void;
  readOnly: boolean;
}

function Station({
  alerts,
  config,
  signs,
  currentTime,
  line,
  signConfigs,
  setConfigs,
  signGroups,
  signsToGroups,
  ungroupSign,
  readOnly,
}: StationProps): JSX.Element {
  const zonePositions = config.zonePositions || {
    left: ['s', 'w'],
    center: ['c', 'm'],
    right: ['n', 'e'],
  };

  return (
    <section key={config.id} aria-label={config.name}>
      <h3>
        {config.name} <small>({config.id})</small>
      </h3>
      <div className="row">
        <div className="col">
          {makeSign(
            alerts,
            config,
            zonePositions.left[0],
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            signGroups,
            signsToGroups,
            ungroupSign,
            readOnly,
          )}
          {makeSign(
            alerts,
            config,
            zonePositions.left[1],
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            signGroups,
            signsToGroups,
            ungroupSign,
            readOnly,
          )}
        </div>
        <div className="col">
          {makeSign(
            alerts,
            config,
            zonePositions.center[0],
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            signGroups,
            signsToGroups,
            ungroupSign,
            readOnly,
          )}
          {makeSign(
            alerts,
            config,
            zonePositions.center[1],
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            signGroups,
            signsToGroups,
            ungroupSign,
            readOnly,
          )}
        </div>
        <div className="col">
          {makeSign(
            alerts,
            config,
            zonePositions.right[0],
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            signGroups,
            signsToGroups,
            ungroupSign,
            readOnly,
          )}
          {makeSign(
            alerts,
            config,
            zonePositions.right[1],
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            signGroups,
            signsToGroups,
            ungroupSign,
            readOnly,
          )}
        </div>
      </div>
      <hr />
    </section>
  );
}

export default Station;

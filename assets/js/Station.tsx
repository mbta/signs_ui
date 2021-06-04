import * as React from 'react';
import SignPanel from './SignPanel';
import { arincToRealtimeId } from './mbta';
import {
  RouteAlerts,
  SignConfig,
  SignConfigs,
  SignContent,
  SingleSignContent,
  StationConfig,
  Zone,
} from './types';
import { defaultZoneLabel } from './helpers';

/* eslint-disable camelcase */

function zoneDescription(
  stationConfig: StationConfig,
  zone: Zone,
): boolean | string | undefined {
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
  readOnly: boolean,
) {
  const zoneConfig = config.zones[zone];
  if (zone && zoneConfig) {
    const key = `${config.id}-${zone}`;
    const signContent = signs[key] || { sign_id: key, lines: {} };
    const realtimeId = arincToRealtimeId(key, line);
    const signConfig = signConfigs[realtimeId] || { mode: 'off' };

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
        setConfigs={setConfigs}
        realtimeId={realtimeId}
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
  readOnly,
}: StationProps): JSX.Element {
  const zonePositions = config.zonePositions || {
    left: ['s', 'w'],
    center: ['c', 'm'],
    right: ['n', 'e'],
  };

  return (
    <div key={config.id}>
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
            readOnly,
          )}
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Station;

import * as React from 'react';
import Sign from './Sign';
import { arincToRealtimeId } from './mbta';
import { SignConfigs, SignContent, StationConfig } from './types';

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
  if (zone && config.zones[zone].value) {
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

interface StationProps {
  config: StationConfig;
  signs: SignContent;
  currentTime: number;
  line: string;
  signConfigs: SignConfigs;
  setConfigs: (x: SignConfigs) => void;
  readOnly: boolean;
}

function Station({
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
            zonePositions.left[0],
            signs,
            currentTime,
            line,
            signConfigs,
            setConfigs,
            readOnly,
          )}
          {makeSign(
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

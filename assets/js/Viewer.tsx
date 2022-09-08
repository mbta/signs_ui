import * as React from 'react';
import Line from './Line';
import {
  Alerts,
  SignContent,
  ConfiguredHeadways,
  RouteSignGroupsWithDeletions,
  SignConfigs,
  SignGroupMap,
} from './types';
import { alertsForLine } from './helpers';

interface ViewerProps {
  alerts: Alerts;
  signs: SignContent;
  currentTime: number;
  line: string;
  signConfigs: SignConfigs;
  configuredHeadways: ConfiguredHeadways;
  setConfigs: (x: SignConfigs) => void;
  setConfiguredHeadways: (x: ConfiguredHeadways) => void;
  readOnly: boolean;
  chelseaBridgeAnnouncements: 'auto' | 'off';
  setChelseaBridgeAnnouncements: (x: 'auto' | 'off') => void;
  signGroups: SignGroupMap;
  setSignGroups: (
    line: string,
    signGroups: RouteSignGroupsWithDeletions,
  ) => void;
  arincToRealtimeIdMap: { [key: string]: string };
}

function Viewer({
  alerts,
  signs,
  currentTime,
  line,
  signConfigs,
  setConfigs,
  readOnly,
  configuredHeadways,
  setConfiguredHeadways,
  setChelseaBridgeAnnouncements,
  chelseaBridgeAnnouncements,
  signGroups,
  setSignGroups,
  arincToRealtimeIdMap,
}: ViewerProps): JSX.Element {
  const routeSignGroups = React.useMemo(
    () => signGroups[line] || {},
    [line, signGroups],
  );

  return (
    <div>
      <Line
        alerts={alertsForLine(alerts, line)}
        signs={signs}
        currentTime={currentTime}
        line={line}
        configuredHeadways={configuredHeadways}
        signConfigs={signConfigs}
        setConfigs={setConfigs}
        setConfiguredHeadways={setConfiguredHeadways}
        chelseaBridgeAnnouncements={chelseaBridgeAnnouncements}
        setChelseaBridgeAnnouncements={setChelseaBridgeAnnouncements}
        signGroups={routeSignGroups}
        setSignGroups={setSignGroups}
        readOnly={readOnly}
        arincToRealtimeIdMap={arincToRealtimeIdMap}
      />
    </div>
  );
}

export default Viewer;

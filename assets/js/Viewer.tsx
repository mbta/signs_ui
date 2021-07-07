import * as React from 'react';
import Line from './Line';
import {
  Alerts,
  SignContent,
  ConfiguredHeadways,
  SignConfigs,
  SignGroupMap,
  SignGroup,
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
  setSignGroup: (line: string, key: string, signGroup: SignGroup) => void;
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
  setSignGroup,
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
        setSignGroup={setSignGroup}
        readOnly={readOnly}
      />
    </div>
  );
}

export default Viewer;

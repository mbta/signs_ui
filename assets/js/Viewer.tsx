import * as React from 'react';
import Line from './Line';
import { SignContent, ConfiguredHeadways, SignConfigs } from './types';

interface ViewerProps {
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
}

function Viewer({
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
}: ViewerProps): JSX.Element {
  return (
    <div>
      <Line
        signs={signs}
        currentTime={currentTime}
        line={line}
        configuredHeadways={configuredHeadways}
        signConfigs={signConfigs}
        setConfigs={setConfigs}
        setConfiguredHeadways={setConfiguredHeadways}
        chelseaBridgeAnnouncements={chelseaBridgeAnnouncements}
        setChelseaBridgeAnnouncements={setChelseaBridgeAnnouncements}
        readOnly={readOnly}
      />
    </div>
  );
}

export default Viewer;

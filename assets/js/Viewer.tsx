import * as React from 'react';
import Line from './Line';
import { SignContent, ConfiguredHeadways, SignConfigs } from './types';

function Viewer({
  signs,
  currentTime,
  line,
  signConfigs,
  setConfigs,
  readOnly,
  configuredHeadways,
  setConfiguredHeadways,
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
        readOnly={readOnly}
      />
    </div>
  );
}

interface ViewerProps {
  signs: SignContent;
  currentTime: number;
  line: string;
  signConfigs: SignConfigs;
  configuredHeadways: ConfiguredHeadways;
  setConfigs: (x: SignConfigs) => void;
  setConfiguredHeadways: (x: ConfiguredHeadways) => void;
  readOnly: boolean;
}

export default Viewer;

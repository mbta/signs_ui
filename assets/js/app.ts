import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../css/app.css';
import 'react-datepicker/dist/react-datepicker.css';
import './toggle-all';
import 'phoenix_html';

import ViewerApp from './ViewerApp';
import { Alerts, ConfiguredHeadways, SignConfigs, SignContent } from './types';

declare global {
  interface Window {
    signOutPath: string;
    initialAlertsData: Alerts;
    initialSignsData: SignContent;
    initialSignConfigs: SignConfigs;
    readOnly: boolean;
    initialChelseaBridgeAnnouncements: 'auto' | 'off';
    initialConfiguredHeadways: ConfiguredHeadways;
  }
}

const realtimeRoot = document.getElementById('viewer-root');
if (realtimeRoot) {
  const {
    initialAlertsData: initialAlerts,
    initialSignsData: initialSigns,
    initialSignConfigs,
    initialChelseaBridgeAnnouncements,
    readOnly,
    initialConfiguredHeadways,
    signOutPath,
  } = window;
  const viewerApp = React.createElement(
    ViewerApp,
    {
      initialAlerts,
      initialSigns,
      initialSignConfigs,
      readOnly,
      initialConfiguredHeadways,
      signOutPath,
      initialChelseaBridgeAnnouncements,
    },
    null,
  );
  ReactDOM.render(viewerApp, realtimeRoot);
}

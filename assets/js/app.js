import React from 'react';
import ReactDOM from 'react-dom';

import '../css/app.css';
import './toggle-all';
import 'phoenix_html';

import ViewerApp from './ViewerApp';

const realtimeRoot = document.getElementById('viewer-root');
if (realtimeRoot) {
  const initialSigns = window.initialSignsData;
  const layoutConfig = window.layoutConfig;
  const arincMap = window.arincMap;
  const viewerApp = React.createElement(ViewerApp, { initialSigns, layoutConfig, arincMap }, null);
  ReactDOM.render(viewerApp, realtimeRoot);
}

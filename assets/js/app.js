import React from 'react';
import ReactDOM from 'react-dom';

import '../css/app.css';
import './toggle-all';
import 'phoenix_html';

import ViewerApp from './ViewerApp';

const realtimeRoot = document.getElementById('viewer-root');
if (realtimeRoot) {
  const initialSigns = window.initialSignsData;
  const initialEnabledSigns = window.initialEnabledSigns;
  const viewerApp = React.createElement(ViewerApp, { initialSigns, initialEnabledSigns }, null);
  ReactDOM.render(viewerApp, realtimeRoot);
}

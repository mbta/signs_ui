import React from 'react';
import ReactDOM from 'react-dom';

import '../css/app.css';
import './toggle-all';
import 'phoenix_html';

import ViewerApp from './ViewerApp';

const realtimeRoot = document.getElementById('viewer-root');
if (realtimeRoot) {
  const { initialSignsData: initialSigns, initialEnabledSigns } = window;
  const viewerApp = React.createElement(ViewerApp, { initialSigns, initialEnabledSigns }, null);
  ReactDOM.render(viewerApp, realtimeRoot);
}

import React from 'react';
import ReactDOM from 'react-dom';

import '../css/app.css';
import '../css/bootstrap-grid.min.css';
import './toggle-all';
import 'phoenix_html';

import ViewerApp from './ViewerApp';

const realtimeRoot = document.getElementById('viewer-root');
if (realtimeRoot) {
  const initialSigns = window.initialSignsData;
  const viewerApp = React.createElement(ViewerApp, { initialSigns }, null);
  ReactDOM.render(viewerApp, realtimeRoot);
}

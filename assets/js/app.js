import React from 'react';
import ReactDOM from 'react-dom';

import '../css/app.css';
import "react-datepicker/dist/react-datepicker.css";
import './toggle-all';
import 'phoenix_html';

import ViewerApp from './ViewerApp';

const realtimeRoot = document.getElementById('viewer-root');
if (realtimeRoot) {
  const { initialSignsData: initialSigns, initialSignConfigs } = window;
  const viewerApp = React.createElement(ViewerApp, { initialSigns, initialSignConfigs }, null);
  ReactDOM.render(viewerApp, realtimeRoot);
}

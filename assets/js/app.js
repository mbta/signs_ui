import css from "../css/app.css"
import "phoenix_html"
import toggle from "./toggle-all.js"

import React from 'react';
import ReactDOM from 'react-dom';

import ViewerApp from './ViewerApp';

const realtimeRoot = document.getElementById("viewer-root");
if (realtimeRoot) {
  ReactDOM.render(<ViewerApp />, realtimeRoot);
}

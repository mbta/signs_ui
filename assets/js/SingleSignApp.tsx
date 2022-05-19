import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SingleSignContent } from './types';
import SingleSign from './SingleSign';

declare global {
  interface Window {
    signContent: SingleSignContent;
  }
}

const root = document.getElementById('app');
const { signContent } = window;
const signText = React.createElement(SingleSign, {
  signContent,
});
ReactDOM.render(signText, root);

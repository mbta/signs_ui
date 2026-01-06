import * as React from 'react';
import { createRoot } from 'react-dom/client';
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
if (root) {
  createRoot(root).render(signText);
}

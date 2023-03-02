import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ViewerApp from '../js/ViewerApp';
import { SignConfigs, SignContent } from '../js/types';

function someSignContent(now: number): SignContent {
  const fresh = new Date(now + 5000).toLocaleString();
  return {
    'RDAV-s': {
      sign_id: 'RDAV-s',
      lines: {
        1: {
          expiration: fresh,
          text: [{ content: 'Alewife 1 min', duration: 5 }],
        },
        2: {
          expiration: fresh,
          text: [{ content: 'Alewife 3 min', duration: 5 }],
        },
      },
    },
    'OGRE-m': {
      sign_id: 'OGRE-m',
      lines: {
        1: {
          expiration: fresh,
          text: [{ content: 'Oak Grove 1 min', duration: 5 }],
        },
        2: {
          expiration: fresh,
          text: [{ content: 'Forest Hills 3 min', duration: 5 }],
        },
      },
    },
  };
}

beforeAll(() => {
  window.arincToRealtimeIdMap = {
    'RDAV-s': 'davis_southbound',
    'OGRE-m': 'green_street_mezzanine',
  };
});

test('Shows all signs for a line', () => {
  const now = Date.now();
  const signs = someSignContent(now);
  const initialSignConfigs = {};
  const readOnly = false;
  const configuredHeadways = {};
  const signOutPath = '/path';

  render(
    React.createElement(
      ViewerApp,
      {
        initialAlerts: {},
        initialSigns: signs,
        initialConfiguredHeadways: configuredHeadways,
        initialChelseaBridgeAnnouncements: 'off',
        initialSignConfigs,
        initialSignGroups: {},
        readOnly,
        signOutPath,
      },
      null,
    ),
  );

  fireEvent.click(screen.getByText('Red'));
  expect(screen.getByText('Alewife')).toBeInTheDocument();
  expect(screen.queryByText('Oak Grove')).toBeNull();
  expect(screen.getAllByTestId(/sign-panel-*/)).toHaveLength(63);

  fireEvent.click(screen.getByText('Orange'));
  expect(screen.getByText('Oak Grove')).toBeInTheDocument();
  expect(screen.queryByText('Alewife')).toBeNull();
  expect(screen.getAllByTestId(/sign-panel-*/)).toHaveLength(62);
});

test('Shows sign out link', () => {
  const now = Date.now();
  const signs = someSignContent(now);
  const initialSignConfigs: SignConfigs = {
    davis_southbound: { mode: 'auto' },
  };
  const readOnly = false;
  const configuredHeadways = {};
  const signOutPath = '/path';

  render(
    React.createElement(
      ViewerApp,
      {
        initialAlerts: {},
        initialSigns: signs,
        initialConfiguredHeadways: configuredHeadways,
        initialChelseaBridgeAnnouncements: 'off',
        initialSignConfigs,
        initialSignGroups: {},
        readOnly,
        signOutPath,
      },
      null,
    ),
  );

  expect(screen.getByRole('link')).toHaveAttribute('href', '/path');
});

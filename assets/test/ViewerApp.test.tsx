import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      audios: [],
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
      audios: [],
    },
  };
}

beforeAll(() => {
  window.arincToRealtimeIdMap = {
    'RDAV-s': 'davis_southbound',
    'OGRE-m': 'green_street_mezzanine',
  };
});

test('Shows all signs for a line', async () => {
  const user = userEvent.setup();
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

  await user.click(screen.getByText('Red'));
  expect(screen.getByText('Alewife')).toBeInTheDocument();
  expect(screen.queryByText('Oak Grove')).toBeNull();
  expect(screen.getAllByRole('heading')).toHaveLength(24);
  expect(screen.getAllByRole('combobox')).toHaveLength(63);

  await user.click(screen.getByText('Orange'));
  expect(screen.getByText('Oak Grove')).toBeInTheDocument();
  expect(screen.queryByText('Alewife')).toBeNull();
  expect(screen.getAllByRole('heading')).toHaveLength(26);
  expect(screen.getAllByRole('combobox')).toHaveLength(62);
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

  expect(screen.getByText('refresh credentials').getAttribute('href')).toBe(
    '/path',
  );
});

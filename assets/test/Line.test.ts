import * as React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Line from '../js/Line';
import {
  ConfiguredHeadways,
  RouteSignGroupsWithDeletions,
  SignConfigs,
  SignContent,
  StationConfig,
} from '../js/types';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

async function setAllToAuto(user: UserEvent) {
  await user.click(screen.getByText('All to auto'));
}

function getModalPrompt(): HTMLElement {
  return screen.getByTestId('modal-prompt');
}

async function acceptModalPrompt(user: UserEvent, modalPrompt: HTMLElement) {
  const acceptButton = within(modalPrompt).getByRole('button', {
    name: 'Yes, set all signs to "auto"',
  });
  await user.click(acceptButton);
}

beforeAll(() => {
  window.arincToRealtimeIdMap = {
    'RSOU-n': 'red_south_station_northbound',
    'RCEN-n': 'central_northbound',
    'RCEN-s': 'central_southbound',
    'RDAV-m': 'davis_mezzanine',
    'RDAV-n': 'davis_northbound',
    'RDAV-s': 'davis_southbound',
  };
});

test('Shows all signs for a line', () => {
  const now = Date.now();
  const signs: SignContent = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs: SignConfigs = {};
  const setConfigs = () => true;
  const setConfiguredHeadways = () => true;
  const readOnly = false;
  const configuredHeadways: ConfiguredHeadways = {};

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  expect(screen.getByText('Alewife')).toBeVisible();
  expect(screen.queryByText('Oak Grove')).toBeNull();
});

test('Shows batch mode buttons when not read-only', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => true;
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  expect(screen.getByText('All to auto')).toBeInTheDocument();
  expect(screen.getByText('All to headway')).toBeInTheDocument();
  expect(screen.getByText('All to off')).toBeInTheDocument();
});

test.each([['Silver'], ['Busway']])(
  'Does not show headway batch mode button',
  (line) => {
    const now = Date.now();
    const signs = {};

    const currentTime = now + 2000;
    const signConfigs = {};
    const setConfigs = () => true;
    const readOnly = false;
    const configuredHeadways = {};
    const setConfiguredHeadways = () => true;

    render(
      React.createElement(
        Line,
        {
          alerts: {},
          signs,
          currentTime,
          line,
          signConfigs,
          setConfigs,
          readOnly,
          configuredHeadways,
          setConfiguredHeadways,
          chelseaBridgeAnnouncements: 'off',
          setChelseaBridgeAnnouncements: () => {},
          signGroups: {},
          setSignGroups: () => {},
        },
        null,
      ),
    );

    expect(screen.getByText('All to auto')).toBeInTheDocument();
    expect(screen.queryByText('All to headway')).toBeNull();
    expect(screen.getByText('All to off')).toBeInTheDocument();
  },
);

test('Shows "Mixed" batch mode buttons when multiple modes are chosen', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs: SignConfigs = {
    red_south_station_northbound: { expires: null, mode: 'headway' },
    central_southbound: { expires: null, mode: 'auto' },
  };
  const setConfigs = () => true;
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  expect(screen.getByText('All to auto')).toBeInTheDocument();
  expect(screen.getByText('All to headway')).toBeInTheDocument();
  expect(screen.getByText('All to off')).toBeInTheDocument();
  expect(screen.getByText('Mixed')).toBeInTheDocument();
});

test('Does not show "Mixed" batch mode buttons when one mode is chosen', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs: SignConfigs = {}; // default all to auto
  const setConfigs = () => true;
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  expect(screen.getByText('All to auto')).toBeInTheDocument();
  expect(screen.getByText('All to headway')).toBeInTheDocument();
  expect(screen.getByText('All to off')).toBeInTheDocument();
  expect(screen.queryByText('Mixed')).toBeNull();
});

test("Doesn't show batch mode buttons when read-only", () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => true;
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  expect(screen.queryByText('All to auto')).toBeNull();
  expect(screen.queryByText('Set all to headway')).toBeNull();
  expect(screen.queryByText('All to off')).toBeNull();
});

type SignGroupCalls = {
  line: string;
  signGroups: RouteSignGroupsWithDeletions;
};

test('Batch mode buttons clear sign groups, too', async () => {
  const user = userEvent.setup();
  const setSignGroupsCalls: SignGroupCalls[] = [];

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs: {},
        currentTime: Date.now() + 2000,
        line: 'Red',
        signConfigs: {
          davis_northbound: {
            mode: 'off',
          },
        },
        setConfigs: () => {},
        readOnly: false,
        configuredHeadways: {},
        setConfiguredHeadways: () => {},
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {
          group1: {
            sign_ids: ['sign1'],
            line1: 'line1',
            line2: 'line2',
            expires: null,
            alert_id: null,
          },
          group2: {
            sign_ids: ['sign2'],
            line1: 'line1b',
            line2: 'line2b',
            expires: null,
            alert_id: null,
          },
        },
        setSignGroups: (line, signGroups) => {
          setSignGroupsCalls.push({ line, signGroups });
        },
      },
      null,
    ),
  );

  await act(async () => {
    await setAllToAuto(user);
  });
  const prompt = getModalPrompt();
  expect(prompt).toHaveTextContent('There are active sign groups at this time');
  await acceptModalPrompt(user, prompt);

  expect(setSignGroupsCalls).toEqual([
    { line: 'Red', signGroups: { group1: {}, group2: {} } },
  ]);
});

test('Shows ConfiguredHeadwaysForm if current line has branches configured', async () => {
  const user = userEvent.setup();
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs: SignConfigs = {};
  const setConfigs = () => true;
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  await act(async () => {
    await user.click(screen.getByText('Bulk Editing'));
    await user.click(screen.getByText('Set Headways'));
  });

  expect(screen.getByRole('form')).toBeInTheDocument();
});

test('Doesn\t show ConfiguredHeadwaysForm if current line has no branches configured', async () => {
  const user = userEvent.setup();
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Another Line';
  const signConfigs = {};
  const setConfigs = () => true;
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  await user.click(screen.getByText('Bulk Editing'));

  expect(screen.queryByText('Set Headways')).toBeNull();
});

test('Shows ConfiguredHeadwaysForm if current line has branches configured in read-only mode', async () => {
  const user = userEvent.setup();
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => true;
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  await user.click(screen.getByText('Bulk Editing'));

  await act(async () => {
    await user.click(screen.getByText('Set Headways'));
  });
  expect(screen.getByRole('form')).toBeInTheDocument();
});

test('Sign config is not affected by batch updates if sign does not support mode', async () => {
  const user = userEvent.setup();
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs: SignConfigs = {
    davis_northbound: { mode: 'auto' },
    davis_southbound: { mode: 'off', expires: null },
  };
  const setConfigs = jest.fn(() => true);
  const setConfiguredHeadways = () => true;
  const readOnly = false;
  const configuredHeadways = {};
  const stationConfigs: StationConfig[] = [
    {
      id: 'RDAV',
      name: 'Alewife',
      zonePositions: {
        left: ['n'],
        center: ['m'],
        right: ['s'],
      },
      zones: {
        n: {
          modes: {
            auto: true,
            custom: true,
            headway: false,
            off: false,
          },
        },
        s: {
          modes: {
            auto: false,
            custom: true,
            headway: true,
            off: false,
          },
        },
        m: {
          modes: {
            auto: false,
            custom: true,
            headway: false,
            off: true,
          },
        },
        e: {
          modes: {
            auto: false,
            custom: true,
            headway: false,
            off: true,
          },
        },
        w: {
          modes: {
            auto: false,
            custom: true,
            headway: false,
            off: false,
          },
        },
        c: {
          modes: {
            auto: false,
            custom: true,
            headway: false,
            off: false,
          },
        },
      },
    },
  ];

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        stationConfigs,
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: () => {},
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  await user.click(screen.getByText('All to off'));
  expect(setConfigs.mock.calls.length).toEqual(1);
  expect(setConfigs).toHaveBeenCalledWith({
    davis_mezzanine: {
      expires: null,
      mode: 'off',
    },
  });

  await user.click(screen.getByText('All to auto'));
  expect(setConfigs.mock.calls.length).toEqual(2);
  expect(setConfigs).toHaveBeenCalledWith({
    davis_northbound: {
      mode: 'auto',
    },
  });

  await user.click(screen.getByText('All to headway'));
  expect(setConfigs.mock.calls.length).toEqual(3);
  expect(setConfigs).toHaveBeenCalledWith({
    davis_southbound: {
      expires: null,
      mode: 'headway',
    },
  });
});

test('can toggle chelsea bridge announcements on on Silver Line page', async () => {
  const user = userEvent.setup();
  const setChelseaBridgeAnnouncements = jest.fn(() => true);
  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs: {},
        currentTime: Date.now() + 2000,
        line: 'Silver',
        signConfigs: {},
        setConfigs: jest.fn(() => true),
        readOnly: false,
        configuredHeadways: {},
        setConfiguredHeadways: () => {},
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements,
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  await user.click(screen.getByLabelText('Chelsea Drawbridge Announcements'));
  expect(setChelseaBridgeAnnouncements.mock.calls.length).toEqual(1);
  expect(setChelseaBridgeAnnouncements).toHaveBeenCalledWith('auto');
});

test('can toggle chelsea bridge announcements off on Silver Line page', async () => {
  const user = userEvent.setup();
  const setChelseaBridgeAnnouncements = jest.fn(() => true);
  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs: {},
        currentTime: Date.now() + 2000,
        line: 'Silver',
        signConfigs: {},
        setConfigs: jest.fn(() => true),
        readOnly: false,
        configuredHeadways: {},
        setConfiguredHeadways: () => {},
        chelseaBridgeAnnouncements: 'auto',
        setChelseaBridgeAnnouncements,
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  await user.click(screen.getByLabelText('Chelsea Drawbridge Announcements'));
  expect(setChelseaBridgeAnnouncements.mock.calls.length).toEqual(1);
  expect(setChelseaBridgeAnnouncements).toHaveBeenCalledWith('off');
});

test('does not show chelsea bridge announcements toggle on non-Silver Line pages', () => {
  const setChelseaBridgeAnnouncements = jest.fn(() => true);
  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs: {},
        currentTime: Date.now() + 2000,
        line: 'Red',
        signConfigs: {},
        setConfigs: jest.fn(() => true),
        readOnly: false,
        configuredHeadways: {},
        setConfiguredHeadways: () => {},
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements,
        signGroups: {},
        setSignGroups: () => {},
      },
      null,
    ),
  );

  expect(
    screen.queryByLabelText('Chelsea Drawbridge Announcements'),
  ).toBeNull();
});

test('does not show chelsea bridge toggle if in read-only mode', () => {
  render(
    React.createElement(Line, {
      alerts: {},
      signs: {},
      currentTime: Date.now() + 2000,
      line: 'Silver',
      signConfigs: {},
      setConfigs: () => {},
      readOnly: true,
      configuredHeadways: {},
      setConfiguredHeadways: () => {},
      chelseaBridgeAnnouncements: 'auto',
      setChelseaBridgeAnnouncements: () => {},
      signGroups: {},
      setSignGroups: () => {},
    }),
  );

  expect(
    screen.getByText('Chelsea Drawbridge Announcements:'),
  ).toBeInTheDocument();
  expect(
    screen.queryByLabelText('Chelsea Drawbridge Announcements'),
  ).toBeNull();
});

test('allows removing an individual sign from a group', async () => {
  const user = userEvent.setup();
  const line = 'Red';
  const setSignGroups = jest.fn();
  const groupKey = '1625778000';

  render(
    React.createElement(
      Line,
      {
        alerts: {},
        signs: {},
        currentTime: Date.now() + 2000,
        line,
        signConfigs: {},
        setConfigs: jest.fn(),
        readOnly: false,
        configuredHeadways: {},
        setConfiguredHeadways: jest.fn(),
        chelseaBridgeAnnouncements: 'off',
        setChelseaBridgeAnnouncements: jest.fn(),
        signGroups: {
          [groupKey]: {
            sign_ids: ['central_northbound', 'central_southbound'],
            line1: 'custom',
            line2: 'text',
            expires: null,
            alert_id: null,
          },
        },
        setSignGroups,
      },
      null,
    ),
  );

  const central = within(screen.getByRole('region', { name: 'Central' }));
  const centralNB = within(central.getByRole('region', { name: 'NB' }));
  await user.click(centralNB.getByRole('button', { name: 'Ungroup' }));
  await user.click(centralNB.getByRole('button', { name: /Yes/ }));

  expect(centralNB.queryByRole('button', { name: /Yes/ })).toBeNull();
  expect(setSignGroups).toHaveBeenCalledWith(line, {
    [groupKey]: {
      sign_ids: ['central_southbound'],
      line1: 'custom',
      line2: 'text',
      expires: null,
      alert_id: null,
    },
  });
});

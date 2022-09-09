import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Line from '../js/Line';
import ConfiguredHeadwaysForm from '../js/ConfiguredHeadwaysForm';
import {
  ConfiguredHeadways,
  RouteSignGroupsWithDeletions,
  SignConfigs,
  SignContent,
  StationConfig,
} from '../js/types';

function setAllToAuto() {
  userEvent.click(screen.getByText('All to auto'));
}

function getModalPrompt(): HTMLElement {
  return screen.getByTestId('modal-prompt');
}

function acceptModalPrompt(modalPrompt: HTMLElement) {
  const acceptButton = within(modalPrompt).getByRole('button', {
    name: 'Yes, set all signs to "auto"',
  });
  userEvent.click(acceptButton);
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

  const wrapper = mount(
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

  expect(wrapper.text()).toMatch('Alewife (RALE)');
  expect(wrapper.text()).not.toMatch('Oak Grove (OOAK)');
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

  const wrapper = mount(
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

  expect(wrapper.text()).toMatch('All to auto');
  expect(wrapper.text()).toMatch('All to headway');
  expect(wrapper.text()).toMatch('All to off');
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

    const wrapper = mount(
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

    expect(wrapper.text()).toMatch('All to auto');
    expect(wrapper.text()).not.toMatch('All to headway');
    expect(wrapper.text()).toMatch('All to off');
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

  const wrapper = mount(
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

  expect(wrapper.text()).toMatch('All to auto');
  expect(wrapper.text()).toMatch('All to headway');
  expect(wrapper.text()).toMatch('All to off');
  expect(wrapper.text()).toMatch('Mixed');
});

test('Does not show "Mixed" batch mode buttons when one mode is chosen', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs: SignConfigs = {
    red_south_station_northbound: { expires: null, mode: 'headway' },
    central_southbound: { expires: null, mode: 'headway' },
  };
  const setConfigs = () => true;
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  const wrapper = mount(
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

  expect(wrapper.text()).toMatch('All to auto');
  expect(wrapper.text()).toMatch('All to headway');
  expect(wrapper.text()).toMatch('All to off');
  expect(wrapper.text()).not.toMatch('Mixed');
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

  const wrapper = mount(
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

  expect(wrapper.text()).not.toMatch('All to auto');
  expect(wrapper.text()).not.toMatch('Set all to headway');
  expect(wrapper.text()).not.toMatch('All to off');
});

type SignGroupCalls = {
  line: string;
  signGroups: RouteSignGroupsWithDeletions;
};

test('Batch mode buttons clear sign groups, too', () => {
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
          alewife_center_southbound: {
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

  setAllToAuto();
  const prompt = getModalPrompt();
  expect(prompt).toHaveTextContent('There are active sign groups at this time');
  acceptModalPrompt(prompt);

  expect(setSignGroupsCalls).toEqual([
    { line: 'Red', signGroups: { group1: {}, group2: {} } },
  ]);
});

test('Shows ConfiguredHeadwaysForm if current line has branches configured', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs: SignConfigs = {};
  const setConfigs = () => true;
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  const wrapper = shallow(
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

  expect(wrapper.find(ConfiguredHeadwaysForm)).toHaveLength(1);
});

test('Doesn\t show ConfiguredHeadwaysForm if current line has no branches configured', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Another Line';
  const signConfigs = {};
  const setConfigs = () => true;
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  const wrapper = shallow(
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

  expect(wrapper.find(ConfiguredHeadwaysForm)).toHaveLength(0);
});

test('Shows ConfiguredHeadwaysForm if current line has branches configured', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => true;
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => true;

  const wrapper = shallow(
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

  expect(wrapper.find(ConfiguredHeadwaysForm)).toHaveLength(1);
});

test('Sign config is not affected by batch updates if sign does not support mode', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs: SignConfigs = {};
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
        center: [],
        right: ['m'],
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

  const wrapper = mount(
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

  const offInput = wrapper.find('input#off');
  offInput.simulate('change');
  expect(setConfigs.mock.calls.length).toEqual(1);
  expect(setConfigs).toHaveBeenCalledWith({
    davis_mezzanine: {
      expires: null,
      mode: 'off',
    },
  });

  const autoInput = wrapper.find('input#auto');
  autoInput.simulate('change');
  expect(setConfigs.mock.calls.length).toEqual(2);
  expect(setConfigs).toHaveBeenCalledWith({
    davis_northbound: {
      mode: 'auto',
    },
  });

  const headwayInput = wrapper.find('input#headway');
  headwayInput.simulate('change');
  expect(setConfigs.mock.calls.length).toEqual(3);
  expect(setConfigs).toHaveBeenCalledWith({
    davis_southbound: {
      expires: null,
      mode: 'headway',
    },
  });
});

test('can toggle chelsea bridge announcements on and off on Silver Line page', () => {
  const setChelseaBridgeAnnouncements = jest.fn(() => true);
  const wrapper = mount(
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

  const chelseaInput = wrapper.find('input[name="chelsea_bridge"]');
  chelseaInput.simulate('change', { target: { checked: true } });
  expect(setChelseaBridgeAnnouncements.mock.calls.length).toEqual(1);
  expect(setChelseaBridgeAnnouncements).toHaveBeenCalledWith('auto');

  chelseaInput.simulate('change', { target: { checked: false } });
  expect(setChelseaBridgeAnnouncements.mock.calls.length).toEqual(2);
  expect(setChelseaBridgeAnnouncements).toHaveBeenCalledWith('off');
});

test('does not show chelsea bridge announcements toggle on non-Silver Line pages', () => {
  const setChelseaBridgeAnnouncements = jest.fn(() => true);
  const wrapper = mount(
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

  const chelseaInput = wrapper.find('input[name="chelsea_bridge"]');
  expect(chelseaInput.exists()).toEqual(false);
});

test('does not show chelsea bridge toggle if in read-only mode', () => {
  const wrapper = mount(
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

  expect(wrapper.text()).toMatch('Chelsea Drawbridge Announcements:Auto');
  const chelseaInput = wrapper.find('input[name="chelsea_bridge"]');
  expect(chelseaInput.exists()).toEqual(false);
});

test('allows removing an individual sign from a group', () => {
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
  userEvent.click(centralNB.getByRole('button', { name: 'Ungroup' }));
  userEvent.click(centralNB.getByRole('button', { name: /Yes/ }));

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

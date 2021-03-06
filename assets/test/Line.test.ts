import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Line from '../js/Line';
import ConfiguredHeadwaysForm from '../js/ConfiguredHeadwaysForm';
import {
  ConfiguredHeadways,
  SignConfigs,
  SignContent,
  StationConfig,
} from '../js/types';

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
        setSignGroup: () => {},
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
        setSignGroup: () => {},
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
          setSignGroup: () => {},
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
        setSignGroup: () => {},
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
        setSignGroup: () => {},
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
        setSignGroup: () => {},
      },
      null,
    ),
  );

  expect(wrapper.text()).not.toMatch('All to auto');
  expect(wrapper.text()).not.toMatch('Set all to headway');
  expect(wrapper.text()).not.toMatch('All to off');
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
        setSignGroup: () => {},
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
        setSignGroup: () => {},
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
        setSignGroup: () => {},
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
        setSignGroup: () => {},
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
        setSignGroup: () => {},
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
        setSignGroup: () => {},
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
      setSignGroup: () => {},
    }),
  );

  expect(wrapper.text()).toMatch('Chelsea Drawbridge Announcements:Auto');
  const chelseaInput = wrapper.find('input[name="chelsea_bridge"]');
  expect(chelseaInput.exists()).toEqual(false);
});

test('allows removing an individual sign from a group', () => {
  const line = 'Red';
  const setSignGroup = jest.fn();
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
        setSignGroup,
      },
      null,
    ),
  );

  const central = within(screen.getByRole('region', { name: 'Central' }));
  const centralNB = within(central.getByRole('region', { name: 'NB' }));
  userEvent.click(centralNB.getByRole('button', { name: 'Ungroup' }));
  userEvent.click(centralNB.getByRole('button', { name: /Yes/ }));

  expect(centralNB.queryByRole('button', { name: /Yes/ })).toBeNull();
  expect(setSignGroup).toHaveBeenCalledWith(line, groupKey, {
    sign_ids: ['central_southbound'],
    line1: 'custom',
    line2: 'text',
    expires: null,
    alert_id: null,
  });
  // TODO: assert sign was returned to auto, once it does that
});

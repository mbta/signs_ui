import React from 'react';
import { mount, shallow } from 'enzyme';
import Line from './Line';
import ConfiguredHeadwaysForm from './ConfiguredHeadwaysForm';

test('Shows all signs for a line', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => {};
  const setConfiguredHeadways = () => {};
  const readOnly = false;
  const configuredHeadways = {};

  const wrapper = mount(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
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
  const setConfigs = () => {};
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = mount(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
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
    const setConfigs = () => {};
    const readOnly = false;
    const configuredHeadways = {};
    const setConfiguredHeadways = () => {};

    const wrapper = mount(
      React.createElement(
        Line,
        {
          signs,
          currentTime,
          line,
          signConfigs,
          setConfigs,
          readOnly,
          configuredHeadways,
          setConfiguredHeadways,
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
  const signConfigs = {
    red_south_station_northbound: { expires: null, mode: 'headway' },
    central_southbound: { expires: null, mode: 'auto' },
  };
  const setConfigs = () => {};
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = mount(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
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
  const signConfigs = {
    red_south_station_northbound: { expires: null, mode: 'headway' },
    central_southbound: { expires: null, mode: 'headway' },
  };
  const setConfigs = () => {};
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = mount(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
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
  const setConfigs = () => {};
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = mount(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
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
  const signConfigs = {};
  const setConfigs = () => {};
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = shallow(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
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
  const setConfigs = () => {};
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = shallow(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
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
  const setConfigs = () => {};
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = shallow(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
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
  const signConfigs = {};
  const setConfigs = jest.fn(() => true);
  const setConfiguredHeadways = () => {};
  const readOnly = false;
  const configuredHeadways = {};
  const stationConfigs = [{
    id: 'RDAV',
    name: 'Alewife',
    zones: {
      n: {
        value: false,
        modes: {
          auto: true, custom: true, headway: false, off: false,
        },
      },
      s: {
        value: false,
        modes: {
          auto: false, custom: true, headway: true, off: false,
        },
      },
      m: {
        value: true,
        modes: {
          auto: false, custom: true, headway: false, off: true,
        },
      },
      e: {
        value: false,
        modes: {
          auto: false, custom: true, headway: false, off: true,
        },
      },
      w: {
        value: false,
        modes: {
          auto: false, custom: true, headway: false, off: false,
        },
      },
      c: {
        value: true,
        modes: {
          auto: false, custom: true, headway: false, off: false,
        },
      },

    },
  }];

  const wrapper = mount(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        stationConfigs,
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

test('can toggle chelsea boarding announcements on and off on Silver Line page', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Silver';
  const signConfigs = {};
  const setConfigs = jest.fn(() => true);
  const chelseaBridgeAnnouncements = 'off';
  const setChelseaBridgeAnnouncements = jest.fn(() => true);
  const setConfiguredHeadways = () => {};
  const readOnly = false;
  const configuredHeadways = {};
  const wrapper = mount(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements,
        setChelseaBridgeAnnouncements,
      },
      null,
    ),
  );

  const chelseaInput = wrapper.find('input#chelsea_boarding');
  chelseaInput.simulate('change', { target: { checked: true } });
  expect(setChelseaBridgeAnnouncements.mock.calls.length).toEqual(1);
  expect(setChelseaBridgeAnnouncements).toHaveBeenCalledWith('auto');

  chelseaInput.simulate('change', { target: { checked: false } });
  expect(setChelseaBridgeAnnouncements.mock.calls.length).toEqual(2);
  expect(setChelseaBridgeAnnouncements).toHaveBeenCalledWith('off');
});

test('does not show chelsea bridge announcements toggle on non-Silver Line pages', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = jest.fn(() => true);
  const chelseaBridgeAnnouncements = 'off';
  const setChelseaBridgeAnnouncements = jest.fn(() => true);
  const setConfiguredHeadways = () => {};
  const readOnly = false;
  const configuredHeadways = {};
  const wrapper = mount(
    React.createElement(
      Line,
      {
        signs,
        currentTime,
        line,
        signConfigs,
        setConfigs,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        chelseaBridgeAnnouncements,
        setChelseaBridgeAnnouncements,
      },
      null,
    ),
  );

  const chelseaInput = wrapper.find('input#chelsea_boarding');
  expect(chelseaInput.exists()).toEqual(false);
});

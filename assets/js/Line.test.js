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
  const setConfigs = () => { };
  const setConfiguredHeadways = () => {};
  const readOnly = false;
  const configuredHeadways = {};

  const wrapper = mount(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    configuredHeadways,
    setConfiguredHeadways,
  }, null));

  expect(wrapper.text()).toMatch('Alewife (RALE)');
  expect(wrapper.text()).not.toMatch('Oak Grove (OOAK)');
});

test('Shows batch mode buttons when not read-only', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = mount(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    configuredHeadways,
    setConfiguredHeadways,
  }, null));

  expect(wrapper.text()).toMatch('All to auto');
  expect(wrapper.text()).toMatch('All to headway');
  expect(wrapper.text()).toMatch('All to off');
});

test('Shows "Mixed" batch mode buttons when multiple modes are chosen', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = { red_south_station_northbound: { expires: null, mode: 'headway' }, central_southbound: { expires: null, mode: 'auto' } };
  const setConfigs = () => { };
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = mount(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    configuredHeadways,
    setConfiguredHeadways,
  }, null));

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
  const signConfigs = { red_south_station_northbound: { expires: null, mode: 'headway' }, central_southbound: { expires: null, mode: 'headway' } };
  const setConfigs = () => { };
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = mount(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    configuredHeadways,
    setConfiguredHeadways,
  }, null));

  expect(wrapper.text()).toMatch('All to auto');
  expect(wrapper.text()).toMatch('All to headway');
  expect(wrapper.text()).toMatch('All to off');
  expect(wrapper.text()).not.toMatch('Mixed');
});

test('Doesn\'t show batch mode buttons when read-only', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = mount(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    configuredHeadways,
    setConfiguredHeadways,
  }, null));

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
  const setConfigs = () => { };
  const readOnly = false;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = shallow(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    configuredHeadways,
    setConfiguredHeadways,
  }, null));

  expect(wrapper.find(ConfiguredHeadwaysForm)).toHaveLength(1);
});

test('Doesn\t show ConfiguredHeadwaysForm if current line has no branches configured', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Another Line';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = shallow(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    configuredHeadways,
    setConfiguredHeadways,
  }, null));

  expect(wrapper.find(ConfiguredHeadwaysForm)).toHaveLength(0);
});

test('Shows ConfiguredHeadwaysForm if current line has branches configured', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = true;
  const configuredHeadways = {};
  const setConfiguredHeadways = () => {};

  const wrapper = shallow(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    configuredHeadways,
    setConfiguredHeadways,
  }, null));

  expect(wrapper.find(ConfiguredHeadwaysForm)).toHaveLength(1);
});

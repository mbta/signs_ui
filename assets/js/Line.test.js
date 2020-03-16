import React from 'react';
import { mount, shallow } from 'enzyme';
import Line from './Line';
import MultiSignHeadwayForm from './MultiSignHeadwayForm';

test('Shows all signs for a line', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => { };
  const setMultiSignHeadwayConfigs = () => {};
  const unsetMultiSignHeadwayConfigs = () => {};
  const readOnly = false;
  const multiSignHeadwayConfigs = {};

  const wrapper = mount(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    multiSignHeadwayConfigs,
    setMultiSignHeadwayConfigs,
    unsetMultiSignHeadwayConfigs,
  }, null));

  expect(wrapper.text()).toMatch('Alewife (RALE)');
  expect(wrapper.text()).not.toMatch('Oak Grove (OOAK)');
});

test('Shows enable / disable all buttons when not read-only', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = false;
  const multiSignHeadwayConfigs = {};
  const setMultiSignHeadwayConfigs = () => {};
  const unsetMultiSignHeadwayConfigs = () => {};

  const wrapper = mount(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    multiSignHeadwayConfigs,
    setMultiSignHeadwayConfigs,
    unsetMultiSignHeadwayConfigs,
  }, null));

  expect(wrapper.text()).toMatch('Enable all');
  expect(wrapper.text()).toMatch('Disable all');
});

test('Doesn\'t show enable / disable all buttons when read-only', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = true;
  const multiSignHeadwayConfigs = {};
  const setMultiSignHeadwayConfigs = () => {};
  const unsetMultiSignHeadwayConfigs = () => {};

  const wrapper = mount(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    multiSignHeadwayConfigs,
    setMultiSignHeadwayConfigs,
    unsetMultiSignHeadwayConfigs,
  }, null));

  expect(wrapper.text()).not.toMatch('Enable all');
  expect(wrapper.text()).not.toMatch('Disable all');
});

test('Shows MultiSignHeadwayForm if current line has branches configured', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = false;
  const multiSignHeadwayConfigs = {};
  const setMultiSignHeadwayConfigs = () => {};
  const unsetMultiSignHeadwayConfigs = () => {};

  const wrapper = shallow(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    multiSignHeadwayConfigs,
    setMultiSignHeadwayConfigs,
    unsetMultiSignHeadwayConfigs,
  }, null));

  expect(wrapper.find(MultiSignHeadwayForm)).toHaveLength(1);
});

test('Doesn\t show MultiSignHeadwayForm if current line has no branches configured', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Another Line';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = true;
  const multiSignHeadwayConfigs = {};
  const setMultiSignHeadwayConfigs = () => {};
  const unsetMultiSignHeadwayConfigs = () => {};

  const wrapper = shallow(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    multiSignHeadwayConfigs,
    setMultiSignHeadwayConfigs,
    unsetMultiSignHeadwayConfigs,
  }, null));

  expect(wrapper.find(MultiSignHeadwayForm)).toHaveLength(0);
});


test('Shows MultiSignHeadwayForm if current line has branches configured', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = true;
  const multiSignHeadwayConfigs = {};
  const setMultiSignHeadwayConfigs = () => {};
  const unsetMultiSignHeadwayConfigs = () => {};

  const wrapper = shallow(React.createElement(Line, {
    signs,
    currentTime,
    line,
    signConfigs,
    setConfigs,
    readOnly,
    multiSignHeadwayConfigs,
    setMultiSignHeadwayConfigs,
    unsetMultiSignHeadwayConfigs,
  }, null));

  expect(wrapper.find(MultiSignHeadwayForm)).toHaveLength(1);
});

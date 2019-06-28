import React from 'react';
import { mount } from 'enzyme';

import Line from './Line';

test('Shows all signs for a line', () => {
  const now = Date.now();
  const signs = {};

  const currentTime = now + 2000;
  const line = 'Red';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = false;

  const wrapper = mount(React.createElement(Line, {
    signs, currentTime, line, signConfigs, setConfigs, readOnly,
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

  const wrapper = mount(React.createElement(Line, {
    signs, currentTime, line, signConfigs, setConfigs, readOnly,
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

  const wrapper = mount(React.createElement(Line, {
    signs, currentTime, line, signConfigs, setConfigs, readOnly,
  }, null));

  expect(wrapper.text()).not.toMatch('Enable all');
  expect(wrapper.text()).not.toMatch('Disable all');
});

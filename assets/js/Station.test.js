import React from 'react';
import { mount } from 'enzyme';

import Station from './Station';

test('shows the custom configuration information for a station', () => {
  const config = {
    id: 'OMAL',
    name: 'Malden Center',
    zones: {
      n: { value: false },
      s: { value: false },
      e: { value: false },
      w: { value: false },
      c: { value: false },
      m: { value: 'Entire Station' },
    },
  };
  const currentTime = Date.now() + 2000;
  const signs = {};
  const line = 'Orange';
  const signConfigs = {};
  const setConfigs = () => {};
  const readOnly = false;

  const wrapper = mount(
    React.createElement(Station, {
      config,
      signs,
      currentTime,
      line,
      signConfigs,
      setConfigs,
      readOnly,
    }),
  );

  expect(wrapper.text()).toMatch('Entire Station');
});

test('allows custom reordering of sign positions', () => {
  const config = {
    id: 'OGRE',
    name: 'Green St',
    zonePositions: {
      left: ['n'],
      center: [],
      right: ['s'],
    },
    zones: {
      n: { value: 'foo' },
      s: { value: 'bar' },
      e: { value: false },
      w: { value: false },
      c: { value: false },
      m: { value: false },
    },
  };
  const currentTime = Date.now() + 2000;
  const signs = {};
  const line = 'Orange';
  const signConfigs = {};
  const setConfigs = () => {};
  const readOnly = false;

  const wrapper = mount(
    React.createElement(Station, {
      config,
      signs,
      currentTime,
      line,
      signConfigs,
      setConfigs,
      readOnly,
    }),
  );

  expect(wrapper.text()).toMatch(/foo.*bar/);
});

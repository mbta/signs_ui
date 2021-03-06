import * as React from 'react';
import { mount } from 'enzyme';

import Station from '../js/Station';
import { StationConfig } from '../js/types';

test('shows the custom configuration information for a station', () => {
  const modes = {
    auto: true,
    custom: true,
    off: true,
    headway: true,
  };
  const config: StationConfig = {
    id: 'OMAL',
    name: 'Malden Center',
    zonePositions: {
      left: ['m'],
      center: [],
      right: [],
    },
    zones: {
      m: { label: 'Entire Station', modes },
    },
  };

  const wrapper = mount(
    React.createElement(Station, {
      config,
      alerts: {},
      signs: {},
      currentTime: Date.now() + 2000,
      line: 'Orange',
      signConfigs: {},
      setConfigs: jest.fn(),
      signGroups: {},
      signsToGroups: {},
      ungroupSign: jest.fn(),
      readOnly: false,
    }),
  );

  expect(wrapper.text()).toMatch('Entire Station');
});

test('allows custom reordering of sign positions', () => {
  const modes = {
    auto: true,
    custom: true,
    off: true,
    headway: true,
  };
  const config: StationConfig = {
    id: 'OGRE',
    name: 'Green St',
    zonePositions: {
      left: ['n'],
      center: [],
      right: ['s'],
    },
    zones: {
      n: { label: 'foo', modes },
      s: { label: 'bar', modes },
    },
  };

  const wrapper = mount(
    React.createElement(Station, {
      config,
      alerts: {},
      signs: {},
      currentTime: Date.now() + 2000,
      line: 'Orange',
      signConfigs: {},
      setConfigs: jest.fn(),
      signGroups: {},
      signsToGroups: {},
      ungroupSign: jest.fn(),
      readOnly: false,
    }),
  );

  expect(wrapper.text()).toMatch(/foo.*bar/);
});

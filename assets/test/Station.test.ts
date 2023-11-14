import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Station from '../js/Station';
import { StationConfig } from '../js/types';

beforeAll(() => {
  window.arincToRealtimeIdMap = {
    'OMAL-m': 'malden_lobby',
  };
});

test('shows the custom configuration information for a station', () => {
  const modes = {
    auto: true,
    custom: true,
    off: true,
    headway: true,
    temporary_terminal: true,
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

  render(
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

  expect(screen.getByText('Entire Station')).toBeInTheDocument();
});

test('allows custom reordering of sign positions', () => {
  const modes = {
    auto: true,
    custom: true,
    off: true,
    headway: true,
    temporary_terminal: true,
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

  render(
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

  const signs = screen.queryAllByRole('region');
  expect(signs[1]).toHaveTextContent('foo');
  expect(signs[2]).toHaveTextContent('bar');
});

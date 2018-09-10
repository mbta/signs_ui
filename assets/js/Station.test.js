import React from 'react';
import { mount } from 'enzyme';

import Station from './Station';

test('shows the custom configuration information for a station', () => {
  const config = {
    id: 'OMAL',
    name: 'Malden Center',
    zones: {
      n: false, s: false, e: false, w: false, c: false, m: 'Entire Station',
    },
  };
  const currentTime = Date.now() + 2000;
  const signs = {
    'OMAL-m': [
      { text: 'Alewife 1 min', duration: (currentTime + 1000).toLocaleString() },
      { text: 'Alewife 3 min', duration: (currentTime + 1000).toLocaleString() },
    ],
  };
  const line = 'Orange';
  const enabledSigns = {};
  const setEnabled = () => {};

  const wrapper = mount(
    React.createElement(Station, {
      config, signs, currentTime, line, enabledSigns, setEnabled,
    }),
  );

  expect(wrapper.text()).toMatch('Entire Station');
});

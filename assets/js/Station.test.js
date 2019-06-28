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
  const signs = {};
  const line = 'Orange';
  const signConfigs = {};
  const setConfigs = () => { };
  const readOnly = false;

  const wrapper = mount(
    React.createElement(Station, {
      config, signs, currentTime, line, signConfigs, setConfigs, readOnly,
    }),
  );

  expect(wrapper.text()).toMatch('Entire Station');
});

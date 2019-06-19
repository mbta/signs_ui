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

  const wrapper = mount(React.createElement(Line, {
    signs, currentTime, line, signConfigs, setConfigs,
  }, null));

  expect(wrapper.text()).toMatch('Alewife (RALE)');
  expect(wrapper.text()).not.toMatch('Oak Grove (OOAK)');
});

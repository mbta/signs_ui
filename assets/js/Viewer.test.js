import React from 'react';
import { mount } from 'enzyme';

import Viewer from './Viewer';

test('does not show messages that have expired', () => {
  const now = Date.now();
  const expired = new Date(now).toLocaleString();
  const fresh = new Date(now + 5000).toLocaleString();
  const signs = { signID: [{ text: 'Alewife 1 min', duration: fresh }, { text: 'Alewife 3 min', duration: expired }] };

  const currentTime = now + 2000;
  const wrapper = mount(React.createElement(Viewer, { signs, currentTime }, null));

  expect(wrapper.text()).toMatch('Alewife 1 min');
  expect(wrapper.text()).not.toMatch('Alewife 3 min');
});

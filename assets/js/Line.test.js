import React from 'react';
import { mount } from 'enzyme';

import Line from './Line';

test('Shows all signs for a line', () => {
  const now = Date.now();
  const fresh = new Date(now + 5000).toLocaleString();
  const signs = { signID: [{ text: 'Alewife 1 min', duration: fresh }, { text: 'Alewife 3 min', duration: fresh }] };

  const currentTime = now + 2000;
  const line = 'Red';

  const wrapper = mount(React.createElement(Line, { signs, currentTime, line }, null));

  expect(wrapper.text()).toMatch('Alewife (RALE)');
  expect(wrapper.text()).not.toMatch('Oak Grove (OOAK)');
});

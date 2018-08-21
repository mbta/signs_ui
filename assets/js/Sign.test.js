import React from 'react';
import { mount } from 'enzyme';

import Sign from './Sign';

test('does not show messages that have expired', () => {
  const now = Date.now();
  const fresh = new Date(now + 5000).toLocaleString();
  const lineOneDuration = fresh;
  const expired = new Date(now).toLocaleString();
  const lineTwoDuration = expired;
  const currentTime = now + 2000;
  const signId = 'RDAV-s';
  const lineOne = 'Alewife 1 min';
  const lineTwo = 'Alewife 3 min';

  const wrapper = mount(
    React.createElement(Sign, {
      signId, lineOne, lineOneDuration, lineTwo, lineTwoDuration, currentTime,
    }, null),
  );

  expect(wrapper.text()).toMatch('Alewife 1 min');
  expect(wrapper.text()).not.toMatch('Alewife 3 min');
});

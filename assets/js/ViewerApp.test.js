import React from 'react';
import { mount } from 'enzyme';

import ViewerApp from './ViewerApp';

test('Shows all signs for a line', () => {
  const now = Date.now();
  const fresh = new Date(now + 5000).toLocaleString();
  const signs = {
    'RDAV-s': [{ text: 'Alewife 1 min', duration: fresh }, { text: 'Alewife 3 min', duration: fresh }],
    'OGRE-m': [{ text: 'Oak Grove 1 min', duration: fresh }, { text: 'Forest Hills 3 min', duration: fresh }],
  };

  const currentTime = now + 2000;
  const line = 'Red';

  const wrapper = mount(
    React.createElement(ViewerApp, { initialSigns: signs, currentTime, line }, null),
  );

  wrapper.find('#red-button').simulate('click');
  expect(wrapper.text()).toMatch('Alewife 1 min');
  expect(wrapper.text()).not.toMatch('Oak Grove 1 min');

  wrapper.find('#orange-button').simulate('click');
  expect(wrapper.text()).toMatch('Oak Grove 1 min');
  expect(wrapper.text()).not.toMatch('Alewife 1 min');
});

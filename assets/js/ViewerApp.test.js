import React from 'react';
import { mount } from 'enzyme';
import ViewerApp from './ViewerApp';

function someSignContent(now) {
  const fresh = new Date(now + 5000).toLocaleString();
  return {
    'RDAV-s': {
      sign_id: 'RDAV-s',
      lines: {
        1: {
          expiration: fresh,
          text: [{ content: 'Alewife 1 min', duration: 5 }],
        },
        2: {
          expiration: fresh,
          text: [{ content: 'Alewife 3 min', duration: 5 }],
        },
      },
    },
    'OGRE-m': {
      sign_id: 'OGRE-m',
      lines: {
        1: {
          expiration: fresh,
          text: [{ content: 'Oak Grove 1 min', duration: 5 }],
        },
        2: {
          expiration: fresh,
          text: [{ content: 'Forest Hills 3 min', duration: 5 }],
        },
      },
    },
  };
}

test('Shows all signs for a line', () => {
  const now = Date.now();
  const signs = someSignContent(now);
  const currentTime = now + 2000;
  const line = 'Red';
  const initialSignConfigs = {};
  const readOnly = false;

  const wrapper = mount(
    React.createElement(ViewerApp, {
      initialSigns: signs, currentTime, line, initialSignConfigs, readOnly,
    }, null),
  );

  wrapper.find('#red-button').simulate('click');
  expect(wrapper.text()).toMatch('Alewife 1 min');
  expect(wrapper.text()).not.toMatch('Oak Grove 1 min');

  wrapper.find('#orange-button').simulate('click');
  expect(wrapper.text()).toMatch('Oak Grove 1 min');
  expect(wrapper.text()).not.toMatch('Alewife 1 min');
});

test('Can enable/disable a sign', () => {
  const now = Date.now();
  const signs = someSignContent();
  const currentTime = now + 2000;
  const line = 'Red';
  const initialSignConfigs = { davis_southbound: { mode: 'auto' } };
  const readOnly = false;

  const wrapper = mount(
    React.createElement(ViewerApp, {
      initialSigns: signs, currentTime, line, initialSignConfigs, readOnly,
    }, null),
  );

  wrapper.find('#red-button').simulate('click');
  expect(wrapper.find('#davis_southbound').props().value).toBe('auto');
  wrapper.find('#davis_southbound').simulate('change', { target: { value: 'off' } });
  expect(wrapper.find('#davis_southbound').props().value).toBe('off');
});

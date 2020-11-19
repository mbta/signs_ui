import * as React from 'react';
import { mount } from 'enzyme';
import ViewerApp from '../js/ViewerApp';
import { SignConfigs, SignContent } from '../js/types';

function someSignContent(now: number): SignContent {
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
  const initialSignConfigs = {};
  const readOnly = false;
  const configuredHeadways = {};
  const signOutPath = '/path';

  const wrapper = mount(
    React.createElement(
      ViewerApp,
      {
        initialSigns: signs,
        initialConfiguredHeadways: configuredHeadways,
        initialChelseaBridgeAnnouncements: false,
        initialSignConfigs,
        readOnly,
        signOutPath,
      },
      null,
    ),
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
  const signs = someSignContent(now);
  const initialSignConfigs: SignConfigs = {
    davis_southbound: { mode: 'auto' },
  };
  const readOnly = false;
  const configuredHeadways = {};
  const signOutPath = '/path';

  const wrapper = mount(
    React.createElement(
      ViewerApp,
      {
        initialSigns: signs,
        initialConfiguredHeadways: configuredHeadways,
        initialChelseaBridgeAnnouncements: false,
        initialSignConfigs,
        readOnly,
        signOutPath,
      },
      null,
    ),
  );

  wrapper.find('#red-button').simulate('click');
  expect(wrapper.find('#davis_southbound').props().value).toBe('auto');
  wrapper
    .find('#davis_southbound')
    .simulate('change', { target: { value: 'off' } });
  expect(wrapper.find('#davis_southbound').props().value).toBe('off');
});

test('Disabling a sign clears any static text', () => {
  const now = Date.now();
  const signs = someSignContent(now);
  const initialSignConfigs: SignConfigs = {
    davis_southbound: { mode: 'static_text', line1: 'foo', line2: 'bar' },
  };
  const readOnly = false;
  const configuredHeadways = {};
  const signOutPath = '/path';

  const wrapper = mount(
    React.createElement(
      ViewerApp,
      {
        initialSigns: signs,
        initialConfiguredHeadways: configuredHeadways,
        initialChelseaBridgeAnnouncements: false,
        initialSignConfigs,
        readOnly,
        signOutPath,
      },
      null,
    ),
  );

  wrapper.find('#red-button').simulate('click');
  wrapper
    .find('#davis_southbound')
    .simulate('change', { target: { value: 'off' } });
  expect(wrapper.find('#davis_southbound').props().value).toBe('off');
  wrapper
    .find('#davis_southbound')
    .simulate('change', { target: { value: 'static_text' } });
  expect(wrapper.find('#davis_southbound-line1-input').props().value).toBe('');
  expect(wrapper.find('#davis_southbound-line2-input').props().value).toBe('');
});

test('Shows sign out link', () => {
  const now = Date.now();
  const signs = someSignContent(now);
  const initialSignConfigs: SignConfigs = {
    davis_southbound: { mode: 'auto' },
  };
  const readOnly = false;
  const configuredHeadways = {};
  const signOutPath = '/path';

  const wrapper = mount(
    React.createElement(
      ViewerApp,
      {
        initialSigns: signs,
        initialConfiguredHeadways: configuredHeadways,
        initialChelseaBridgeAnnouncements: false,
        initialSignConfigs,
        readOnly,
        signOutPath,
      },
      null,
    ),
  );

  expect(wrapper.find('#sign-out-link').props().href).toBe('/path');
});

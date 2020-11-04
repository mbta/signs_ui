import * as React from 'react';
import { mount } from 'enzyme';

import Sign from '../js/Sign';
import { SignConfig, SingleSignContent } from '../js/types';

function signContentWithExpirations(time1: string, time2: string): SingleSignContent {
  return {
    sign_id: 'RDAV-n',
    lines: {
      1: {
        text: [
          {
            content: 'Alewife 1 min',
            duration: 5,
          },
        ],
        expiration: time1,
      },
      2: {
        text: [
          {
            content: 'Alewife 3 min',
            duration: 5,
          },
        ],
        expiration: time2,
      },
    },
  };
}

test('does not show messages that have expired', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const expired = new Date(now).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent = signContentWithExpirations(fresh, expired);
  const setConfigs = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: true,
    custom: true,
    headway: true,
    off: true,
  };

  const wrapper = mount(
    React.createElement(
      Sign,
      {
        signId,
        signContent,
        currentTime,
        line,
        signConfig,
        setConfigs,
        realtimeId,
        readOnly,
        modes,
      },
      null,
    ),
  );

  expect(wrapper.text()).toMatch('Alewife 1 min      ');
  expect(wrapper.text()).toMatch('3:15');

  expect(wrapper.text()).not.toMatch('Alewife 3 min');
});

test('does not show select in read-only mode', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent: SingleSignContent = signContentWithExpirations(fresh, fresh);
  const setConfigs = () => true;
  const realtimeId = 'id';
  const readOnly = true;
  const modes = {
    auto: true,
    custom: true,
    headway: true,
    off: true,
  };

  const wrapper = mount(
    React.createElement(
      Sign,
      {
        modes,
        signId,
        signContent,
        currentTime,
        line,
        signConfig,
        setConfigs,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(wrapper.html()).not.toMatch('select');
});

test('shows the mode the sign is in in read-only mode', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent: SingleSignContent = signContentWithExpirations(fresh, fresh);
  const setConfigs = () => true;
  const realtimeId = 'id';
  const readOnly = true;
  const modes = {
    auto: true, off: true, headway: true, custom: true,
  };

  const wrapper = mount(
    React.createElement(
      Sign,
      {
        modes,
        signId,
        signContent,
        currentTime,
        line,
        signConfig,
        setConfigs,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(wrapper.html()).toMatch('Auto');
});

test('does show select when not in read-only mode', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent = signContentWithExpirations(fresh, fresh);
  const setConfigs = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: true,
    custom: true,
    headway: true,
    off: true,
  };

  const wrapper = mount(
    React.createElement(
      Sign,
      {
        signId,
        signContent,
        currentTime,
        line,
        modes,
        signConfig,
        setConfigs,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(wrapper.html()).toMatch('select');
});

test.each([
  [
    { auto: true },
    {
      auto: true, static_text: false, headway: false, off: false,
    },
  ],
  [
    { auto: true, headway: true },
    {
      auto: true, static_text: false, headway: true, off: false,
    },
  ],
  [
    { custom: true },
    {
      auto: false, static_text: true, headway: false, off: false,
    },
  ],
  [
    { off: true },
    {
      auto: false, static_text: false, headway: false, off: true,
    },
  ],
])('shows configured mode select options', (modesOverride, expected) => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent = signContentWithExpirations(fresh, fresh);
  const setConfigs = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: false,
    headway: false,
    custom: false,
    off: false,
    ...modesOverride,
  };

  const wrapper = mount(
    React.createElement(
      Sign,
      {
        signId,
        signContent,
        currentTime,
        line,
        signConfig,
        setConfigs,
        realtimeId,
        readOnly,
        modes,
      },
      null,
    ),
  );
  expect(wrapper.html()).toMatch('select');
  Object.keys(expected).forEach((x) => {
    expect(wrapper.find(`option[value="${x}"]`).exists()).toEqual(expected[x]);
  });
});

test('shows the return to auto time field if sign can be set to auto', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'static_text' };
  const signContent = signContentWithExpirations(fresh, fresh);
  const setConfigs = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: true,
    custom: true,
    headway: true,
    off: true,
  };

  const wrapper = mount(
    React.createElement(
      Sign,
      {
        signId,
        signContent,
        currentTime,
        line,
        modes,
        signConfig,
        setConfigs,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(wrapper.html()).toMatch('Schedule return to "Auto"');
});

test('does not show the return to auto time field if sign can be set to auto', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'off' };
  const signContent = signContentWithExpirations(fresh, fresh);
  const setConfigs = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: false,
    custom: false,
    headway: false,
    off: true,
  };

  const wrapper = mount(
    React.createElement(
      Sign,
      {
        signId,
        signContent,
        currentTime,
        line,
        modes,
        signConfig,
        setConfigs,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(wrapper.html()).not.toMatch('Schedule return to "Auto"');
});

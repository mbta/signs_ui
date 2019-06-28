import React from 'react';
import { mount } from 'enzyme';

import Sign from './Sign';

function signContentWithExpirations(time1, time2) {
  return {
    sign_id: 'RDAV-n',
    lines: {
      1: {
        text: [{
          content: 'Alewife 1 min',
          duration: 5,
        }],
        expiration: time1,
      },
      2: {
        text: [{
          content: 'Alewife 3 min',
          duration: 5,
        }],
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
  const signConfig = { mode: 'auto' };
  const signContent = signContentWithExpirations(fresh, expired);
  const setConfigs = () => { };
  const realtimeId = 'id';
  const readOnly = false;

  const wrapper = mount(
    React.createElement(Sign, {
      signId,
      signContent,
      currentTime,
      line,
      signConfig,
      setConfigs,
      realtimeId,
      readOnly,
    }, null),
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
  const signConfig = { mode: 'auto' };
  const signContent = signContentWithExpirations(fresh, fresh);
  const setConfigs = () => { };
  const realtimeId = 'id';
  const readOnly = true;

  const wrapper = mount(
    React.createElement(Sign, {
      signId,
      signContent,
      currentTime,
      line,
      signConfig,
      setConfigs,
      realtimeId,
      readOnly,
    }, null),
  );

  expect(wrapper.html()).not.toMatch('select');
});

test('does show select when not in read-only mode', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig = { mode: 'auto' };
  const signContent = signContentWithExpirations(fresh, fresh);
  const setConfigs = () => { };
  const realtimeId = 'id';
  const readOnly = false;

  const wrapper = mount(
    React.createElement(Sign, {
      signId,
      signContent,
      currentTime,
      line,
      signConfig,
      setConfigs,
      realtimeId,
      readOnly,
    }, null),
  );

  expect(wrapper.html()).toMatch('select');
});

import React from 'react';
import { mount } from 'enzyme';

import SetExpiration from './SetExpiration';

test('Can set the expiration time', () => {
  const requests = [];

  const setConfigs = (arg) => {
    requests.push(arg);
  };

  const readOnly = false;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: null,
      },
      setConfigs,
      readOnly,
    }),
  );

  wrapper.find('.react-datepicker-wrapper input').simulate('focus');
  wrapper.find('.react-datepicker__day--015').simulate('click');
  expect(requests.length).toBe(1);
  const newConf = requests[0].rtID;
  expect(new Date(newConf.expires)).toBeInstanceOf(Date);
});

test('Can clear the expiration time', () => {
  const requests = [];

  const setConfigs = (arg) => {
    requests.push(arg);
  };

  const readOnly = false;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: (new Date()).toISOString(),
      },
      setConfigs,
      readOnly,
    }),
  );

  wrapper.find('.viewer--cancel-expiration-button').simulate('click');
  expect(requests.length).toBe(1);
  const newConf = requests[0].rtID;
  expect(newConf.expires).toBe(null);
});

test('Shows widget when no expiration set if not in read-only mode', () => {
  const setConfigs = () => { };

  const readOnly = false;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: '',
      },
      setConfigs,
      readOnly,
    }),
  );

  expect(wrapper.text()).toMatch('Schedule return');
});

test('Suppresses widget when no expiration set if in read-only mode', () => {
  const setConfigs = () => { };

  const readOnly = true;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: '',
      },
      setConfigs,
      readOnly,
    }),
  );

  expect(wrapper.text()).toBe(null);
});

test('Shows \'Scheduled\' when expiration is set if in read-only mode', () => {
  const setConfigs = () => { };

  const readOnly = true;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: (new Date()).toISOString(),
      },
      setConfigs,
      readOnly,
    }),
  );

  expect(wrapper.text()).toMatch('Scheduled return');
});

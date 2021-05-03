import * as React from 'react';
import { mount } from 'enzyme';

import SetExpiration from '../js/SetExpiration';
import { SignConfigs } from '../js/types';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

test('Can set the expiration time', () => {
  const requests: SignConfigs[] = [];
  const readOnly = false;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        id: '1',
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: null,
      },
      setConfigs: (arg) => {
        requests.push(arg);
      },
      readOnly,
    }),
  );

  wrapper.find('.react-datepicker-wrapper input').simulate('focus');
  wrapper.find('.react-datepicker__day--015').simulate('click');
  expect(requests.length).toBe(1);
  const newConf = requests[0].rtID;
  expect(new Date(newConf.expires!)).toBeInstanceOf(Date);
});

test('Can clear the expiration time', () => {
  const requests: SignConfigs[] = [];
  const readOnly = false;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        id: '1',
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: new Date().toISOString(),
      },
      setConfigs: (arg) => {
        requests.push(arg);
      },
      readOnly,
    }),
  );

  wrapper.find('.viewer--cancel-expiration-button').simulate('click');
  expect(requests.length).toBe(1);
  const newConf = requests[0].rtID;
  expect(newConf.expires).toBe(null);
});

test('Shows widget when no expiration set if not in read-only mode', () => {
  const setConfigs = () => true;

  const readOnly = false;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        id: '1',
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: null,
      },
      setConfigs,
      readOnly,
    }),
  );

  expect(wrapper.text()).toMatch('Schedule return');
});

test('Suppresses widget when no expiration set if in read-only mode', () => {
  const setConfigs = () => true;

  const readOnly = true;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        id: '1',
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: '',
      },
      setConfigs,
      readOnly,
    }),
  );

  expect(wrapper.text()).toBe('');
});

test("Shows 'Scheduled' when expiration is set if in read-only mode", () => {
  const setConfigs = () => true;

  const readOnly = true;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        id: '1',
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: new Date().toISOString(),
      },
      setConfigs,
      readOnly,
    }),
  );

  expect(wrapper.text()).toMatch('Scheduled return');
});

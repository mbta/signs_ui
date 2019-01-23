import React from 'react';
import { mount } from 'enzyme';

import SetExpiration from './SetExpiration';

test('Can set the expiration time', () => {
  const requests = [];

  const setConfigs = (arg) => {
    requests.push(arg);
  };

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
    }),
  );

  wrapper.find('.react-datepicker-wrapper input').simulate('focus');
  wrapper.find('.react-datepicker__day--024').simulate('click');
  expect(requests.length).toBe(1);
  const newConf = requests[0].rtID;
  expect(newConf.expires).toBeInstanceOf(Date);
});

test('Can clear the expiration time', () => {
  const requests = [];

  const setConfigs = (arg) => {
    requests.push(arg);
  };

  const wrapper = mount(
    React.createElement(SetExpiration, {
      realtimeId: 'rtID',
      signConfig: {
        mode: 'static_text',
        line1: 'line1',
        line2: 'line2',
        expires: new Date(),
      },
      setConfigs,
    }),
  );

  wrapper.find('.viewer--cancel-expiration-button').simulate('click');
  expect(requests.length).toBe(1);
  const newConf = requests[0].rtID;
  expect(newConf.expires).toBe(null);
});

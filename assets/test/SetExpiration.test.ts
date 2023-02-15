import * as React from 'react';
import { mount } from 'enzyme';

import SetExpiration from '../js/SetExpiration';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

test('Can set the expiration time', () => {
  const dates: (Date | null)[] = [];
  const readOnly = false;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      alerts: {},
      expires: null,
      alertId: null,
      onDateChange: (d) => dates.push(d),
      onAlertChange: () => true,
      readOnly,
      showAlertSelector: true,
    }),
  );

  wrapper.find('input[type="checkbox"]').simulate('click');
  wrapper.find('.set_expiration--datetime').simulate('change');
  wrapper.find('.react-datepicker-wrapper input').simulate('focus');
  wrapper.find('.react-datepicker__day--015').simulate('click');
  expect(dates.length).toBe(1);
  expect(dates[0]?.getDate()).toBe(15);
});

test('Can clear the expiration time', async () => {
  const user = userEvent.setup();
  const dates: (Date | null)[] = [];
  const readOnly = false;

  render(
    React.createElement(SetExpiration, {
      alerts: {
        Red: {
          id: 'bar',
          created_at: null,
          service_effect: 'nothing',
        },
      },
      expires: null,
      alertId: null,
      onDateChange: (d) => dates.push(d),
      onAlertChange: () => true,
      readOnly,
      showAlertSelector: true,
    }),
  );

  await user.click(
    screen.getByRole('checkbox', { name: 'Schedule return to "Auto"' }),
  );
  await user.click(screen.getByRole('radio', { name: 'Date and time' }));
  await user.click(
    screen.getByRole('radio', { name: 'At the end of an alert effect period' }),
  );

  expect(dates.length).toBe(1);
  expect(dates[0]).toBe(null);
});

test('Deselecting return to auto clears the expiration ', async () => {
  const user = userEvent.setup();
  const dates: (Date | null)[] = [];
  const alerts: (string | null)[] = [];
  const readOnly = false;

  render(
    React.createElement(SetExpiration, {
      alerts: {
        Red: {
          id: 'bar',
          created_at: null,
          service_effect: 'nothing',
        },
      },
      expires: null,
      alertId: null,
      onDateChange: (d) => dates.push(d),
      onAlertChange: (a) => alerts.push(a),
      readOnly,
      showAlertSelector: true,
    }),
  );

  await user.click(
    screen.getByRole('checkbox', { name: 'Schedule return to "Auto"' }),
  );
  await user.click(
    screen.getByRole('checkbox', { name: 'Schedule return to "Auto"' }),
  );

  expect(dates.length).toBe(1);
  expect(alerts.length).toBe(1);
  expect(dates[0]).toBe(null);
  expect(alerts[0]).toBe(null);
});

test('Shows widget when no expiration set if not in read-only mode', () => {
  const readOnly = false;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      alerts: {},
      expires: null,
      alertId: null,
      onDateChange: () => true,
      onAlertChange: () => true,
      readOnly,
      showAlertSelector: true,
    }),
  );

  expect(wrapper.text()).toMatch('Schedule return');
});

test('Suppresses widget when no expiration set if in read-only mode', () => {
  const readOnly = true;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      alerts: {},
      expires: null,
      alertId: null,
      onDateChange: () => true,
      onAlertChange: () => true,
      readOnly,
      showAlertSelector: true,
    }),
  );

  expect(wrapper.text()).toBe('');
});

test("Shows 'Scheduled' when expiration is set if in read-only mode", () => {
  const readOnly = true;

  const wrapper = mount(
    React.createElement(SetExpiration, {
      alerts: {},
      expires: new Date(),
      alertId: null,
      onDateChange: () => true,
      onAlertChange: () => true,
      readOnly,
      showAlertSelector: true,
    }),
  );

  expect(wrapper.text()).toMatch('Scheduled return');
});

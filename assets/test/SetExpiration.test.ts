import * as React from 'react';

import SetExpiration from '../js/SetExpiration';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

test('Can set the expiration time', async () => {
  const dates: (Date | null)[] = [];
  const readOnly = false;

  render(
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

  await waitFor(() =>
    userEvent.click(screen.getByText('Schedule return to "Auto"')),
  );
  await waitFor(() =>
    userEvent.click(screen.getByTestId('set_datetime_radio')),
  );
  fireEvent.click(screen.getByText('15'));

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

  render(
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

  expect(screen.getByText('Schedule return to "Auto"')).toBeInTheDocument();
});

test('Suppresses widget when no expiration set if in read-only mode', () => {
  const readOnly = true;

  render(
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

  expect(screen.queryByText('Schedule return to "Auto"')).toBeNull();
});

test("Shows 'Scheduled' when expiration is set if in read-only mode", () => {
  const readOnly = true;

  render(
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

  expect(screen.getByText('Scheduled return to "Auto"')).toBeInTheDocument();
});

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertPicker from '../js/AlertPicker';

test('can choose an alert from the pop-up', async () => {
  const user = userEvent.setup();
  let chosenAlertId = null;

  render(
    React.createElement(AlertPicker, {
      alerts: {
        alert1: {
          id: 'alert1',
          service_effect: "there's a problem",
          created_at: null,
        },
        alert2: {
          id: 'alert2',
          service_effect: 'some problem',
          created_at: null,
        },
      },
      alertId: '',
      onChange: (alertId) => {
        chosenAlertId = alertId;
      },
      disabled: false,
    }),
  );

  await user.click(screen.getByRole('textbox', { name: /alert id picker/i }));
  await user.click(screen.getByRole('button', { name: 'alert1' }));

  expect(chosenAlertId).toEqual('alert1');
});

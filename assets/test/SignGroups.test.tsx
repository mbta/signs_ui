import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignGroups from '../js/SignGroups';
import { SignGroup } from '../js/types';

function openForm() {
  userEvent.click(screen.getByText('Create'));
}

function chooseZones(zones: string[]) {
  zones.forEach((z) => userEvent.click(screen.getByText(z)));
}

function setMessage(line1: string, line2: string) {
  userEvent.type(screen.getByAltText('Line one custom text input'), line1);
  userEvent.type(screen.getByAltText('Line two custom text input'), line2);
}

function chooseAlert(alertId: string) {
  userEvent.click(screen.getByRole('textbox', { name: /alert id picker/i }));
  userEvent.click(screen.getByRole('button', { name: alertId }));
}

function applyForm() {
  userEvent.click(screen.getByRole('button', { name: 'Apply' }));
}

test('can create a sign group', () => {
  let signGroupSubmissions: Array<{
    line: string;
    timestamp: number;
    signGroup: SignGroup;
  }> = [];

  const line = 'Red';
  const currentTime = 1622149913;

  render(
    React.createElement(SignGroups, {
      line,
      currentTime,
      alerts: {
        alert1: {
          id: 'alert1',
          service_effect: "there's a problem",
          created_at: null,
        },
      },
      signGroups: {},
      setSignGroup: (line: string, timestamp: number, signGroup: SignGroup) => {
        signGroupSubmissions.push({ line, timestamp, signGroup });
      },
      readOnly: false,
    }),
  );

  openForm();
  chooseZones(['Arrival Platform', 'Braintree Platform NB']);
  setMessage('Line 1 text', 'Line 2 text');
  chooseAlert('alert1');
  applyForm();

  expect(signGroupSubmissions).toEqual([
    {
      line,
      timestamp: currentTime,
      signGroup: {
        sign_ids: [
          'south_station_silver_line_arrival_platform',
          'jfk_umass_braintree_platform_northbound',
        ],
        line1: 'Line 1 text',
        line2: 'Line 2 text',
        expires: null,
        alert_id: 'alert1',
      },
    },
  ]);
});

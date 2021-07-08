import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignGroups from '../js/SignGroups';
import { SignGroup } from '../js/types';

function openNewGroupForm() {
  userEvent.click(screen.getByRole('button', { name: 'Create' }));
}

function openEditGroupForm(timestamp: string) {
  const groupContext = within(screen.getByTestId(timestamp, { exact: false }));
  userEvent.click(groupContext.getByRole('button', { name: 'Edit' }));
}

function toggleZones(zones: string[]) {
  zones.forEach((z) => userEvent.click(screen.getByTestId(z)));
}

function setMessage(line1: string, line2: string) {
  const line1Input = screen.getByAltText('Line one custom text input');
  const line2Input = screen.getByAltText('Line two custom text input');
  userEvent.clear(line1Input);
  userEvent.clear(line2Input);
  userEvent.type(line1Input, line1);
  userEvent.type(line2Input, line2);
}

function chooseAlert(alertId: string) {
  userEvent.click(screen.getByRole('textbox', { name: /alert id picker/i }));
  userEvent.click(screen.getByRole('button', { name: alertId }));
}

function newGroupSubmitButton() {
  return screen.getByRole('button', { name: 'Create group' });
}

function editGroupSubmitButton() {
  return screen.getByRole('button', { name: 'Apply changes' });
}

function cancelFormButton() {
  return screen.getByRole('button', { name: 'Cancel' });
}

type SignGroupUpdate = {
  line: string;
  timestamp: number;
  signGroup: SignGroup;
};

test('can create a sign group', () => {
  let signGroupSubmissions: Array<SignGroupUpdate> = [];
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
      setSignGroup: (line, timestamp, signGroup) => {
        signGroupSubmissions.push({ line, timestamp, signGroup });
      },
      readOnly: false,
    }),
  );

  openNewGroupForm();
  toggleZones(['central_northbound', 'central_southbound']);
  setMessage('Line 1 text', 'Line 2 text');
  chooseAlert('alert1');
  userEvent.click(newGroupSubmitButton());

  expect(signGroupSubmissions).toEqual([
    {
      line,
      timestamp: currentTime,
      signGroup: {
        sign_ids: ['central_northbound', 'central_southbound'],
        line1: 'Line 1 text',
        line2: 'Line 2 text',
        expires: null,
        alert_id: 'alert1',
      },
    },
  ]);
});

test('can cancel creating a sign group', () => {
  let signGroupSubmissions: Array<SignGroupUpdate> = [];

  render(
    React.createElement(SignGroups, {
      line: 'Red',
      currentTime: 1622149913,
      alerts: {},
      signGroups: {},
      setSignGroup: (line, timestamp, signGroup) => {
        signGroupSubmissions.push({ line, timestamp, signGroup });
      },
      readOnly: false,
    }),
  );

  openNewGroupForm();
  toggleZones(['central_northbound', 'central_southbound']);
  setMessage('Line 1 text', 'Line 2 text');
  userEvent.click(cancelFormButton());
  openNewGroupForm();

  expect(signGroupSubmissions).toEqual([]);
  expect(screen.getByAltText('Line one custom text input')).toHaveValue('');
});

test('requires selecting at least one sign', () => {
  render(
    React.createElement(SignGroups, {
      line: 'Red',
      currentTime: 1622149913,
      alerts: {},
      signGroups: {},
      setSignGroup: (line, timestamp, signGroup) => {},
      readOnly: false,
    }),
  );

  openNewGroupForm();
  toggleZones(['central_northbound']);
  toggleZones(['central_northbound']);
  setMessage('Line 1 text', 'Line 2 text');

  expect(newGroupSubmitButton()).toBeDisabled();
});

test('can edit an existing sign group', () => {
  let signGroupSubmissions: Array<SignGroupUpdate> = [];
  const line = 'Blue';
  const timestamp = 1622149900;

  render(
    React.createElement(SignGroups, {
      line,
      currentTime: 1622149913,
      alerts: {},
      signGroups: {
        [timestamp]: {
          sign_ids: ['airport_westbound', 'airport_eastbound'],
          line1: 'custom',
          line2: 'text',
          expires: null,
          alert_id: null,
        },
      },
      setSignGroup: (line, timestamp, signGroup) => {
        signGroupSubmissions.push({ line, timestamp, signGroup });
      },
      readOnly: false,
    }),
  );

  openEditGroupForm(timestamp.toString());
  toggleZones(['airport_eastbound', 'maverick_westbound']);
  setMessage('other', 'text');
  userEvent.click(editGroupSubmitButton());

  expect(signGroupSubmissions).toEqual([
    {
      line,
      timestamp: timestamp,
      signGroup: {
        sign_ids: ['airport_westbound', 'maverick_westbound'],
        line1: 'other',
        line2: 'text',
        expires: null,
        alert_id: null,
      },
    },
  ]);
});

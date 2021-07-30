import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignGroups from '../js/SignGroups';
import { RouteSignGroupsWithDeletions } from '../js/types';

function openNewGroupForm() {
  userEvent.click(screen.getByRole('button', { name: 'Create' }));
}

function openEditGroupForm(groupKey: string) {
  const groupContext = within(screen.getByTestId(groupKey, { exact: false }));
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
  userEvent.click(
    screen.getByRole('checkbox', { name: 'Schedule return to "Auto"' }),
  );
  userEvent.click(
    screen.getByRole('radio', { name: 'At the end of an alert effect period' }),
  );
  userEvent.click(screen.getByRole('button', { name: alertId }));
}

function newGroupSubmitButton() {
  return screen.getByRole('button', { name: 'Create' });
}

function editGroupSubmitButton() {
  return screen.getByRole('button', { name: 'Apply' });
}

function cancelFormButton() {
  return screen.getByRole('button', { name: 'Cancel' });
}

function returnToAutoButton() {
  return screen.getByRole('button', { name: 'Return to “Auto”' });
}

function getModalPrompt(): HTMLElement {
  return screen.getByTestId('modal-prompt');
}

function cancelModalPrompt(modalPrompt: HTMLElement) {
  const cancelButton = within(modalPrompt).getByRole('button', {
    name: 'Cancel',
  });
  userEvent.click(cancelButton);
}

function acceptModalPrompt(modalPrompt: HTMLElement) {
  const acceptButton = within(modalPrompt).getByRole('button', {
    name: 'Yes, reassign this sign',
  });
  userEvent.click(acceptButton);
}

type SignGroupUpdate = {
  line: string;
  signGroups: RouteSignGroupsWithDeletions;
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
      setSignGroups: (line, signGroups) => {
        signGroupSubmissions.push({ line, signGroups });
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
      signGroups: {
        [currentTime.toString()]: {
          sign_ids: ['central_northbound', 'central_southbound'],
          line1: 'Line 1 text',
          line2: 'Line 2 text',
          expires: null,
          alert_id: 'alert1',
        },
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
      setSignGroups: (line, signGroups) => {
        signGroupSubmissions.push({ line, signGroups });
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
      setSignGroups: (line, signGroups) => {},
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
  const groupKey = '1622149900';

  render(
    React.createElement(SignGroups, {
      line,
      currentTime: 1622149913,
      alerts: {},
      signGroups: {
        [groupKey]: {
          sign_ids: ['airport_westbound', 'airport_eastbound'],
          line1: 'custom',
          line2: 'text',
          expires: null,
          alert_id: null,
        },
      },
      setSignGroups: (line, signGroups) => {
        signGroupSubmissions.push({ line, signGroups });
      },
      readOnly: false,
    }),
  );

  openEditGroupForm(groupKey);
  toggleZones(['airport_eastbound', 'maverick_westbound']);
  setMessage('other', 'text');
  userEvent.click(editGroupSubmitButton());

  expect(signGroupSubmissions).toEqual([
    {
      line,
      signGroups: {
        [groupKey]: {
          sign_ids: ['airport_westbound', 'maverick_westbound'],
          line1: 'other',
          line2: 'text',
          expires: null,
          alert_id: null,
        },
      },
    },
  ]);
});

test('can cancel prompt when moving a sign from one sign group to another', () => {
  const signGroupSubmissions: Array<SignGroupUpdate> = [];
  const otherSignGroupKey = 1622149900;
  const newSignGroupKey = otherSignGroupKey + 1;

  render(
    React.createElement(SignGroups, {
      line: 'Orange',
      currentTime: newSignGroupKey,
      alerts: {},
      signGroups: {
        [otherSignGroupKey]: {
          sign_ids: [
            'orange_north_station_commuter_rail_exit',
            'orange_north_station_northbound',
          ],
          line1: 'custom',
          line2: 'text',
          expires: null,
          alert_id: null,
        },
      },
      setSignGroups: (line, signGroups) => {
        signGroupSubmissions.push({ line, signGroups });
      },
      readOnly: false,
    }),
  );

  openNewGroupForm();
  setMessage('text1', 'text2');
  toggleZones(['tufts_southbound', 'orange_north_station_commuter_rail_exit']);

  const modalPrompt = getModalPrompt();

  expect(modalPrompt).toHaveTextContent(
    'The North Station CR Exit sign is part of an active sign group',
  );

  cancelModalPrompt(modalPrompt);
  userEvent.click(newGroupSubmitButton());

  expect(
    signGroupSubmissions[0].signGroups[`${newSignGroupKey}`].sign_ids,
  ).toEqual(['tufts_southbound']);
});

test('can accept prompt when moving a sign from one sign group to another', () => {
  const signGroupSubmissions: Array<SignGroupUpdate> = [];
  const otherSignGroupKey = 1622149900;
  const newSignGroupKey = otherSignGroupKey + 1;
  const movingId = 'orange_north_station_commuter_rail_exit';

  render(
    React.createElement(SignGroups, {
      line: 'Orange',
      currentTime: newSignGroupKey,
      alerts: {},
      signGroups: {
        [otherSignGroupKey]: {
          sign_ids: [movingId, 'orange_north_station_northbound'],
          line1: 'custom',
          line2: 'text',
          expires: null,
          alert_id: null,
        },
      },
      setSignGroups: (line, signGroups) => {
        signGroupSubmissions.push({ line, signGroups });
      },
      readOnly: false,
    }),
  );

  openNewGroupForm();
  setMessage('text1', 'text2');
  toggleZones(['tufts_southbound', movingId]);

  const modalPrompt = getModalPrompt();

  expect(modalPrompt).toHaveTextContent(
    'The North Station CR Exit sign is part of an active sign group',
  );

  acceptModalPrompt(modalPrompt);
  userEvent.click(newGroupSubmitButton());

  expect(
    signGroupSubmissions[0].signGroups[`${newSignGroupKey}`].sign_ids,
  ).toContain(movingId);
});

test('can return a sign group back to auto', () => {
  const signGroupSubmissions: Array<SignGroupUpdate> = [];
  const signGroupKey = 1622149900;

  render(
    React.createElement(SignGroups, {
      line: 'Orange',
      currentTime: signGroupKey + 1,
      alerts: {},
      signGroups: {
        [signGroupKey]: {
          sign_ids: ['orange_north_station_northbound'],
          line1: 'custom',
          line2: 'text',
          expires: null,
          alert_id: null,
        },
      },
      setSignGroups: (line, signGroups) => {
        signGroupSubmissions.push({ line, signGroups });
      },
      readOnly: false,
    }),
  );

  userEvent.click(returnToAutoButton());
  expect(signGroupSubmissions).toEqual([
    {
      line: 'Orange',
      signGroups: { [signGroupKey]: {} },
    },
  ]);
});

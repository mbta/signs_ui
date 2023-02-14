import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignGroups from '../js/SignGroups';
import { RouteSignGroupsWithDeletions } from '../js/types';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

async function openNewGroupForm(user: UserEvent) {
  await user.click(screen.getByRole('button', { name: 'Create' }));
}

async function openEditGroupForm(user: UserEvent, groupKey: string) {
  const groupContext = within(screen.getByTestId(groupKey, { exact: false }));
  await user.click(groupContext.getByRole('button', { name: 'Edit' }));
}

async function toggleZones(user: UserEvent, zones: string[]) {
  for (const z of zones) {
    await user.click(screen.getByTestId(z));
  }
}

async function setMessage(user: UserEvent, line1: string, line2: string) {
  const line1Input = screen.getByAltText('Line one custom text input');
  const line2Input = screen.getByAltText('Line two custom text input');
  await user.clear(line1Input);
  await user.clear(line2Input);
  await user.type(line1Input, line1);
  await user.type(line2Input, line2);
}

async function chooseAlert(user: UserEvent, alertId: string) {
  await user.click(
    screen.getByRole('checkbox', { name: 'Schedule return to "Auto"' }),
  );
  await user.click(
    screen.getByRole('radio', { name: 'At the end of an alert effect period' }),
  );
  await user.click(screen.getByRole('button', { name: alertId }));
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

async function cancelModalPrompt(user: UserEvent, modalPrompt: HTMLElement) {
  const cancelButton = within(modalPrompt).getByRole('button', {
    name: 'Cancel',
  });
  await user.click(cancelButton);
}

async function acceptModalPrompt(user: UserEvent, modalPrompt: HTMLElement) {
  const acceptButton = within(modalPrompt).getByRole('button', {
    name: 'Yes, reassign this sign',
  });
  await user.click(acceptButton);
}

type SignGroupUpdate = {
  line: string;
  signGroups: RouteSignGroupsWithDeletions;
};

beforeAll(() => {
  window.arincToRealtimeIdMap = {
    'RCEN-n': 'central_northbound',
    'RCEN-s': 'central_southbound',
    'BAIR-w': 'airport_westbound',
    'BAIR-e': 'airport_eastbound',
    'BMAV-w': 'maverick_westbound',
    'ONST-m': 'orange_north_station_commuter_rail_exit',
    'ONST-n': 'orange_north_station_northbound',
    'ONEM-s': 'tufts_southbound',
  };
});

test('can create a sign group', async () => {
  const user = userEvent.setup();
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

  await openNewGroupForm(user);
  await toggleZones(user, ['central_northbound', 'central_southbound']);
  await setMessage(user, 'Line 1 text', 'Line 2 text');
  await chooseAlert(user, 'alert1');
  await user.click(newGroupSubmitButton());

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

test('can cancel creating a sign group', async () => {
  const user = userEvent.setup();
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

  await openNewGroupForm(user);
  await toggleZones(user, ['central_northbound', 'central_southbound']);
  await setMessage(user, 'Line 1 text', 'Line 2 text');
  await user.click(cancelFormButton());
  await openNewGroupForm(user);

  expect(signGroupSubmissions).toEqual([]);
  expect(screen.getByAltText('Line one custom text input')).toHaveValue('');
});

test('requires selecting at least one sign', async () => {
  const user = userEvent.setup();
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

  await openNewGroupForm(user);
  await toggleZones(user, ['central_northbound']);
  await toggleZones(user, ['central_northbound']);
  await setMessage(user, 'Line 1 text', 'Line 2 text');

  expect(newGroupSubmitButton()).toBeDisabled();
});

test('can edit an existing sign group', async () => {
  const user = userEvent.setup();
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

  await openEditGroupForm(user, groupKey);
  await toggleZones(user, ['airport_eastbound', 'maverick_westbound']);
  await setMessage(user, 'other', 'text');
  await user.click(editGroupSubmitButton());

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

test('can cancel prompt when moving a sign from one sign group to another', async () => {
  const user = userEvent.setup();
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

  await openNewGroupForm(user);
  await setMessage(user, 'text1', 'text2');
  await toggleZones(user, [
    'tufts_southbound',
    'orange_north_station_commuter_rail_exit',
  ]);

  const modalPrompt = getModalPrompt();

  expect(modalPrompt).toHaveTextContent(
    'The North Station CR Exit sign is part of an active sign group',
  );

  await cancelModalPrompt(user, modalPrompt);
  await user.click(newGroupSubmitButton());

  expect(
    signGroupSubmissions[0].signGroups[`${newSignGroupKey}`].sign_ids,
  ).toEqual(['tufts_southbound']);
});

test('can accept prompt when moving a sign from one sign group to another', async () => {
  const user = userEvent.setup();
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

  await openNewGroupForm(user);
  await setMessage(user, 'text1', 'text2');
  await toggleZones(user, ['tufts_southbound', movingId]);

  const modalPrompt = getModalPrompt();

  expect(modalPrompt).toHaveTextContent(
    'The North Station CR Exit sign is part of an active sign group',
  );

  await acceptModalPrompt(user, modalPrompt);
  await user.click(newGroupSubmitButton());

  expect(
    signGroupSubmissions[0].signGroups[`${newSignGroupKey}`].sign_ids,
  ).toContain(movingId);
});

test('can return a sign group back to auto', async () => {
  const user = userEvent.setup();
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

  await user.click(returnToAutoButton());
  expect(signGroupSubmissions).toEqual([
    {
      line: 'Orange',
      signGroups: { [signGroupKey]: {} },
    },
  ]);
});

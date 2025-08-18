import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SignPanel, { SignModeOptions, SignPanelProps } from '../js/SignPanel';
import {
  ZoneConfig,
  SignConfig,
  SignGroup,
  SingleSignContent,
} from '../js/types';

function customSignContent(): SingleSignContent {
  const now = new Date().valueOf();
  const soon = new Date(now + 5000).toLocaleString();

  return {
    sign_id: 'RDAV-n',
    lines: {
      1: {
        text: [
          {
            content: 'No trains',
            duration: 5,
          },
        ],
        expiration: soon,
      },
      2: {
        text: [
          {
            content: 'Use shuttle bus',
            duration: 5,
          },
        ],
        expiration: soon,
      },
    },
    audios: [],
  };
}

function customModeSignProps(): SignPanelProps {
  const now = new Date().valueOf();

  return {
    alerts: {},
    signId: 'RDAV-n',
    signContent: customSignContent(),
    currentTime: now + 2000,
    line: 'Red',
    signConfig: { mode: 'static_text' },
    setConfig: () => true,
    realtimeId: 'id',
    readOnly: false,
    modes: {
      auto: true,
      custom: true,
      off: true,
      temporary_terminal: true,
    },
  };
}

function customModeSignPropsWithStaticContent(): SignPanelProps {
  const now = new Date().valueOf();

  return {
    alerts: {},
    signId: 'RDAV-n',
    signContent: customSignContent(),
    currentTime: now + 2000,
    line: 'Red',
    signConfig: { mode: 'static_text', line1: 'foo', line2: 'bar' },
    setConfig: () => true,
    realtimeId: 'id',
    readOnly: false,
    modes: {
      auto: true,
      custom: true,
      off: true,
      temporary_terminal: true,
    },
  };
}

function signContentWithExpirations(
  time1: string,
  time2: string,
): SingleSignContent {
  return {
    sign_id: 'RDAV-n',
    lines: {
      1: {
        text: [
          {
            content: 'Alewife 1 min',
            duration: 5,
          },
        ],
        expiration: time1,
      },
      2: {
        text: [
          {
            content: 'Alewife 3 min',
            duration: 5,
          },
        ],
        expiration: time2,
      },
    },
    audios: [],
  };
}

test('does not show messages that have expired', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const expired = new Date(now).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent = signContentWithExpirations(fresh, expired);
  const setConfig = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: true,
    custom: true,
    off: true,
    temporary_terminal: true,
  };

  render(
    React.createElement(
      SignPanel,
      {
        alerts: {},
        signId,
        signContent,
        currentTime,
        line,
        signConfig,
        setConfig,
        realtimeId,
        readOnly,
        modes,
      },
      null,
    ),
  );

  expect(
    screen.getByText('Alewife 1 min       3:15', { collapseWhitespace: false }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText('Alewife 3 min       3:15', {
      collapseWhitespace: false,
    }),
  ).toBeNull();
});

test('does not show select in read-only mode', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent: SingleSignContent = signContentWithExpirations(
    fresh,
    fresh,
  );
  const setConfig = () => true;
  const realtimeId = 'id';
  const readOnly = true;
  const modes = {
    auto: true,
    custom: true,
    off: true,
    temporary_terminal: true,
  };

  render(
    React.createElement(
      SignPanel,
      {
        alerts: {},
        modes,
        signId,
        signContent,
        currentTime,
        line,
        signConfig,
        setConfig,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(screen.queryByRole('combobox')).toBeNull();
});

test('shows the mode the sign is in in read-only mode', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent: SingleSignContent = signContentWithExpirations(
    fresh,
    fresh,
  );
  const setConfig = () => true;
  const realtimeId = 'id';
  const readOnly = true;
  const modes = {
    auto: true,
    off: true,
    custom: true,
    temporary_terminal: true,
  };

  render(
    React.createElement(
      SignPanel,
      {
        alerts: {},
        modes,
        signId,
        signContent,
        currentTime,
        line,
        signConfig,
        setConfig,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(screen.getByText('Auto')).toBeInTheDocument();
  expect(screen.queryByRole('combobox')).toBeNull();
});

test('does show select when not in read-only mode', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent = signContentWithExpirations(fresh, fresh);
  const setConfig = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: true,
    custom: true,
    off: true,
    temporary_terminal: true,
  };

  render(
    React.createElement(
      SignPanel,
      {
        alerts: {},
        signId,
        signContent,
        currentTime,
        line,
        modes,
        signConfig,
        setConfig,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(screen.getByRole('combobox')).toBeInTheDocument();
});

test.each([
  [
    { auto: true },
    {
      auto: true,
      static_text: false,
      off: false,
      temporary_terminal: false,
    },
  ],
  [
    { custom: true },
    {
      auto: false,
      static_text: true,
      off: false,
      temporary_terminal: false,
    },
  ],
  [
    { off: true },
    {
      auto: false,
      static_text: false,
      off: true,
      temporary_terminal: false,
    },
  ],
])(
  'shows configured mode select options',
  (
    modesOverride,
    expected: {
      auto: boolean;
      static_text: boolean;
      off: boolean;
      temporary_terminal: boolean;
    },
  ) => {
    const now = new Date('2019-01-15T20:15:00Z').valueOf();
    const fresh = new Date(now + 5000).toLocaleString();
    const currentTime = now + 2000;
    const signId = 'RDAV-n';
    const line = 'Red';
    const signConfig: SignConfig = { mode: 'auto' };
    const signContent = signContentWithExpirations(fresh, fresh);
    const setConfig = () => true;
    const realtimeId = 'id';
    const readOnly = false;
    const modes: ZoneConfig['modes'] = {
      auto: false,
      custom: false,
      off: false,
      temporary_terminal: false,
      ...modesOverride,
    };

    render(
      React.createElement(
        SignPanel,
        {
          alerts: {},
          signId,
          signContent,
          currentTime,
          line,
          signConfig,
          setConfig,
          realtimeId,
          readOnly,
          modes,
        },
        null,
      ),
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();

    const options = screen
      .getAllByRole('option')
      .map((option) => option.getAttribute('value'));

    (Object.keys(expected) as Array<SignModeOptions>).forEach((mode) => {
      if (expected[mode] && expected[mode] === true) {
        expect(options.includes(mode)).toBeTruthy();
      } else {
        expect(options.includes(mode)).toBeFalsy();
      }
    });
  },
);

test('can enable/disable a sign', async () => {
  const user = userEvent.setup();
  const setConfig = jest.fn(() => true);

  render(
    React.createElement(
      SignPanel,
      { ...customModeSignProps(), setConfig },
      null,
    ),
  );

  await user.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'Off' }),
  );
  expect(setConfig).toHaveBeenCalledWith({ expires: null, mode: 'off' });

  await user.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'Auto' }),
  );
  expect(setConfig).toHaveBeenCalledWith({ mode: 'auto' });
});

test('Disabling a sign clears any static text', async () => {
  const user = userEvent.setup();
  const setConfig = jest.fn(() => true);
  render(
    React.createElement(
      SignPanel,
      { ...customModeSignPropsWithStaticContent(), setConfig },
      null,
    ),
  );

  expect(
    screen.getByAltText('Line one custom text input').getAttribute('value'),
  ).toBe('foo');
  expect(
    screen.getByAltText('Line two custom text input').getAttribute('value'),
  ).toBe('bar');

  await user.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'Off' }),
  );
  await user.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'Custom' }),
  );
  expect(
    screen.getByAltText('Line one custom text input').getAttribute('value'),
  ).toBe('');
  expect(
    screen.getByAltText('Line two custom text input').getAttribute('value'),
  ).toBe('');
});

test('shows the return to auto time field if sign can be set to auto', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'static_text' };
  const signContent = signContentWithExpirations(fresh, fresh);
  const setConfig = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: true,
    custom: true,
    off: true,
    temporary_terminal: true,
  };

  render(
    React.createElement(
      SignPanel,
      {
        alerts: {},
        signId,
        signContent,
        currentTime,
        line,
        modes,
        signConfig,
        setConfig,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(screen.getByText('Schedule return to "Auto"')).toBeInTheDocument();
});

test('does not show the return to auto time field if sign cannot be set to auto', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'off' };
  const signContent = signContentWithExpirations(fresh, fresh);
  const setConfig = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: false,
    custom: false,
    off: true,
    temporary_terminal: true,
  };

  render(
    React.createElement(
      SignPanel,
      {
        alerts: {},
        signId,
        signContent,
        currentTime,
        line,
        modes,
        signConfig,
        setConfig,
        realtimeId,
        readOnly,
      },
      null,
    ),
  );

  expect(screen.queryByText('Schedule return to "Auto"')).toBeNull();
});

test('shows clock even when no other content is present', () => {
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const expired = new Date(now).toLocaleString();
  const currentTime = now + 2000;
  const signId = 'RDAV-n';
  const line = 'Red';
  const signConfig: SignConfig = { mode: 'auto' };
  const signContent = signContentWithExpirations(expired, expired);
  const setConfig = () => true;
  const realtimeId = 'id';
  const readOnly = false;
  const modes = {
    auto: true,
    custom: true,
    off: true,
    temporary_terminal: true,
  };

  render(
    React.createElement(
      SignPanel,
      {
        alerts: {},
        signId,
        signContent,
        currentTime,
        line,
        signConfig,
        setConfig,
        realtimeId,
        readOnly,
        modes,
      },
      null,
    ),
  );

  expect(screen.getByText('3:15')).toBeInTheDocument();
});

test('does not show a group indicator if the sign is not grouped', () => {
  render(React.createElement(SignPanel, customModeSignProps(), null));

  expect(screen.queryByText('Grouped')).toBeNull();
});

test('shows info about the group if the sign is grouped', () => {
  const signGroup: SignGroup = {
    sign_ids: ['id'],
    line1: 'custom',
    line2: 'text',
    expires: null,
    alert_id: '123456',
  };
  const props = { ...customModeSignProps(), signGroup: signGroup };
  render(React.createElement(SignPanel, props, null));

  expect(screen.queryByRole('heading', { name: 'Grouped' })).toBeVisible();
  const groupInfo = screen.getByText('Scheduled return to auto:');
  expect(groupInfo).toHaveTextContent('when alert 123456 closes');
});

test('allows ungrouping the sign if it is grouped', async () => {
  const user = userEvent.setup();
  const signGroup: SignGroup = {
    sign_ids: ['id'],
    line1: 'custom',
    line2: 'text',
    expires: null,
    alert_id: null,
  };
  const ungroupFn = jest.fn();
  const props: SignPanelProps = {
    ...customModeSignProps(),
    signGroup: signGroup,
    ungroupSign: ungroupFn,
  };
  render(React.createElement(SignPanel, props, null));

  await user.click(screen.getByRole('button', { name: 'Ungroup' }));
  await user.click(
    screen.getByRole('button', { name: 'Yes, ungroup this sign' }),
  );

  expect(ungroupFn).toHaveBeenCalled();
});

test('allows backing out of the ungrouping prompt', async () => {
  const user = userEvent.setup();
  const signGroup: SignGroup = {
    sign_ids: ['id'],
    line1: 'custom',
    line2: 'text',
    expires: null,
    alert_id: null,
  };
  const ungroupFn = jest.fn();
  const props: SignPanelProps = {
    ...customModeSignProps(),
    signGroup: signGroup,
    ungroupSign: ungroupFn,
  };
  render(React.createElement(SignPanel, props, null));

  await user.click(screen.getByRole('button', { name: 'Ungroup' }));
  await user.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(ungroupFn).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Ungroup' })).not.toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
});

test('does not save changes to backend until Apply is pressed', async () => {
  const user = userEvent.setup();
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;

  const setConfigHistory: SignConfig[] = [];

  render(
    React.createElement(SignPanel, {
      alerts: {
        alert1: {
          id: 'alert1',
          service_effect: "there's a problem",
          created_at: null,
        },
      },
      signId: 'signId',
      modes: {
        auto: true,
        custom: true,
        off: true,
        temporary_terminal: true,
      },
      signContent: signContentWithExpirations(fresh, fresh),
      currentTime,
      line: 'Red',
      setConfig: (signConfig: SignConfig) => {
        setConfigHistory.push(signConfig);
      },
      signConfig: { mode: 'auto' },
      realtimeId: 'arincId',
      readOnly: false,
    }),
  );

  await user.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'Custom' }),
  );
  await user.type(screen.getByAltText('Line one custom text input'), 'line1');
  await user.type(screen.getByAltText('Line two custom text input'), 'line2');
  await user.click(screen.getByLabelText('Schedule return to "Auto"'));
  await user.click(screen.getByLabelText('Date and time'));
  await user.click(
    screen.getByLabelText('At the end of an alert effect period'),
  );
  await user.click(screen.getByRole('button', { name: 'alert1' }));

  expect(setConfigHistory).toEqual([]);

  await user.click(screen.getByRole('button', { name: 'Apply' }));

  expect(setConfigHistory).toEqual([
    {
      mode: 'static_text',
      line1: 'line1',
      line2: 'line2',
      expires: null,
      alert_id: 'alert1',
    },
  ]);
});

test("allows setting custom text for signs with no 'Auto' mode", async () => {
  const user = userEvent.setup();
  const now = new Date('2019-01-15T20:15:00Z').valueOf();
  const fresh = new Date(now + 5000).toLocaleString();
  const currentTime = now + 2000;

  const setConfigHistory: SignConfig[] = [];

  render(
    React.createElement(SignPanel, {
      alerts: {},
      signId: 'signId',
      modes: {
        auto: false,
        custom: true,
        off: true,
        temporary_terminal: false,
      },
      signContent: signContentWithExpirations(fresh, fresh),
      currentTime: currentTime,
      line: 'Silver',
      setConfig: (signConfig: SignConfig) => {
        setConfigHistory.push(signConfig);
      },
      signConfig: { mode: 'off' },
      realtimeId: 'arincId',
      readOnly: false,
    }),
  );

  expect(screen.queryByText('Set custom message')).toBeNull();

  await user.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'Custom' }),
  );

  expect(screen.queryByText('Set custom message')).not.toBeNull();
  expect(screen.queryByText('Schedule return to "Auto"')).toBeNull();

  await user.type(screen.getByAltText('Line one custom text input'), 'line1');
  await user.type(screen.getByAltText('Line two custom text input'), 'line2');

  await user.click(screen.getByRole('button', { name: 'Apply' }));

  expect(setConfigHistory).toEqual([
    {
      mode: 'static_text',
      line1: 'line1',
      line2: 'line2',
      expires: null,
    },
  ]);
});

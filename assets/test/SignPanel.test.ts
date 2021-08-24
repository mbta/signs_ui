import * as React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SignPanel, { SignModeOptions, SignPanelProps } from '../js/SignPanel';
import {
  ZoneConfig,
  SignConfig,
  SignGroup,
  SingleSignContent,
  SignConfigs,
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
      headway: true,
      off: true,
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
    headway: true,
    off: true,
  };

  const wrapper = mount(
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

  expect(wrapper.text()).toMatch('Alewife 1 min      ');
  expect(wrapper.text()).toMatch('3:15');

  expect(wrapper.text()).not.toMatch('Alewife 3 min');
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
    headway: true,
    off: true,
  };

  const wrapper = mount(
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

  expect(wrapper.html()).not.toMatch('select');
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
    headway: true,
    custom: true,
  };

  const wrapper = mount(
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

  expect(wrapper.html()).toMatch('Auto');
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
    headway: true,
    off: true,
  };

  const wrapper = mount(
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

  expect(wrapper.html()).toMatch('select');
});

test.each([
  [
    { auto: true },
    {
      auto: true,
      static_text: false,
      headway: false,
      off: false,
    },
  ],
  [
    { auto: true, headway: true },
    {
      auto: true,
      static_text: false,
      headway: true,
      off: false,
    },
  ],
  [
    { custom: true },
    {
      auto: false,
      static_text: true,
      headway: false,
      off: false,
    },
  ],
  [
    { off: true },
    {
      auto: false,
      static_text: false,
      headway: false,
      off: true,
    },
  ],
])(
  'shows configured mode select options',
  (
    modesOverride,
    expected: {
      auto: boolean;
      static_text: boolean;
      headway: boolean;
      off: boolean;
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
      headway: false,
      custom: false,
      off: false,
      ...modesOverride,
    };

    const wrapper = mount(
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
    expect(wrapper.html()).toMatch('select');
    (Object.keys(expected) as Array<SignModeOptions>).forEach((x) => {
      expect(wrapper.find(`option[value="${x}"]`).exists()).toEqual(
        expected[x],
      );
    });
  },
);

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
    headway: true,
    off: true,
  };

  const wrapper = mount(
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

  expect(wrapper.html()).toMatch('Schedule return to "Auto"');
});

test('does not show the return to auto time field if sign can be set to auto', () => {
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
    headway: false,
    off: true,
  };

  const wrapper = mount(
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

  expect(wrapper.html()).not.toMatch('Schedule return to "Auto"');
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
    headway: true,
    off: true,
  };

  const wrapper = mount(
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

  expect(wrapper.text()).toMatch('3:15');
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

test('allows ungrouping the sign if it is grouped', () => {
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

  userEvent.click(screen.getByRole('button', { name: 'Ungroup' }));
  userEvent.click(
    screen.getByRole('button', { name: 'Yes, ungroup this sign' }),
  );

  expect(ungroupFn).toHaveBeenCalled();
});

test('allows backing out of the ungrouping prompt', () => {
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

  userEvent.click(screen.getByRole('button', { name: 'Ungroup' }));
  userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(ungroupFn).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Ungroup' })).not.toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
});

test('does not save changes to backend until Apply is pressed', () => {
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
      modes: { auto: true, custom: true, headway: true, off: true },
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

  userEvent.selectOptions(screen.getByTestId('arincId'), 'Custom');
  userEvent.type(screen.getByTestId('arincId-line1-input'), 'line1');
  userEvent.type(screen.getByTestId('arincId-line2-input'), 'line2');
  userEvent.click(screen.getByLabelText('Schedule return to "Auto"'));
  userEvent.click(screen.getByLabelText('Date and time'));
  userEvent.click(
    screen.getByLabelText('At the end of an alert effect period'),
  );
  userEvent.click(screen.getByRole('button', { name: 'alert1' }));

  expect(setConfigHistory).toEqual([]);

  userEvent.click(screen.getByRole('button', { name: 'Apply' }));

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

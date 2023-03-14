import * as React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfiguredHeadwaysForm, {
  ConfiguredHeadwaysFormProps,
} from '../js/ConfiguredHeadwaysForm';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */

let branches: ConfiguredHeadwaysFormProps['branches'];
let timePeriods: ConfiguredHeadwaysFormProps['timePeriods'];
let readOnly: ConfiguredHeadwaysFormProps['readOnly'];
let configuredHeadways: ConfiguredHeadwaysFormProps['configuredHeadways'];
let setConfiguredHeadways: ConfiguredHeadwaysFormProps['setConfiguredHeadways'];
window.confirm = jest.fn(() => true);

beforeEach(() => {
  branches = [
    { id: 'branch_1', name: 'Branch 1' },
    { id: 'branch_2', name: 'Branch' },
  ];
  timePeriods = [
    { id: 'morning', name: 'Morning', description: 'morning' },
    { id: 'evening', name: 'Evening', description: 'evening' },
  ];
  setConfiguredHeadways = jest.fn(() => true);
  readOnly = false;
  configuredHeadways = {};
});

function renderWrapper() {
  render(
    React.createElement(
      ConfiguredHeadwaysForm,
      {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      },
      null,
    ),
  );
}

describe('With Multi-sign Headway not enabled', () => {
  test('Can enable multi-sign headways when form is complete', async () => {
    const user = userEvent.setup();
    const { container } = render(
      React.createElement(ConfiguredHeadwaysForm, {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      }),
    );

    await act(async () => {
      await user.type(
        container.querySelector(
          'input[name="branches.[0].morning.range_low"]',
        )!,
        '2',
      );
      await user.type(
        container.querySelector(
          'input[name="branches.[0].morning.range_high"]',
        )!,
        '5',
      );
      await user.type(
        container.querySelector(
          'input[name="branches.[0].evening.range_low"]',
        )!,
        '2',
      );
      await user.type(
        container.querySelector(
          'input[name="branches.[0].evening.range_high"]',
        )!,
        '5',
      );
      await user.type(
        container.querySelector(
          'input[name="branches.[1].morning.range_low"]',
        )!,
        '5',
      );
      await user.type(
        container.querySelector(
          'input[name="branches.[1].morning.range_high"]',
        )!,
        '10',
      );
      await user.type(
        container.querySelector(
          'input[name="branches.[1].evening.range_low"]',
        )!,
        '5',
      );

      await user.type(
        container.querySelector(
          'input[name="branches.[1].evening.range_high"]',
        )!,
        '10',
      );

      await user.tab();
      await user.click(screen.getByRole('button', { name: 'Apply' }));
    });

    await waitFor(() => {
      expect(setConfiguredHeadways).toHaveBeenCalledWith({
        branch_1: {
          morning: { range_low: 2, range_high: 5 },
          evening: { range_low: 2, range_high: 5 },
        },
        branch_2: {
          morning: { range_low: 5, range_high: 10 },
          evening: { range_low: 5, range_high: 10 },
        },
      });
    });
  });
});

describe('With Multi-sign Headway enabled', () => {
  beforeEach(() => {
    configuredHeadways = {
      branch_1: {
        morning: {
          range_low: 2,
          range_high: 3,
        },
        evening: {
          range_low: 1,
          range_high: 8,
        },
      },
      branch_2: {
        morning: {
          range_low: 2,
          range_high: 3,
        },
        evening: {
          range_low: 1,
          range_high: 8,
        },
      },
    };
  });

  test('Form is initially open', async () => {
    await act(async () => {
      renderWrapper();
    });
    expect(screen.getByRole('form')).toBeVisible();
  });

  test('Inputs are initially disabled', async () => {
    await act(async () => {
      renderWrapper();
    });

    const inputs = screen.queryAllByRole('input');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('disabled');
    });
  });

  test('Clicking button enables inputs', async () => {
    const user = userEvent.setup();
    renderWrapper();
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'edit' }));
    });

    const inputs = screen.queryAllByRole('input');
    inputs.forEach((input) => {
      expect(input).not.toHaveAttribute('disabled');
    });
  });

  test('Can apply new values after making edits', async () => {
    const user = userEvent.setup();
    const { container } = render(
      React.createElement(ConfiguredHeadwaysForm, {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      }),
    );

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'edit' }));
      await waitFor(() => {
        expect(container.querySelector('input[disabled]')).toEqual(null);
      });

      await user.clear(
        container.querySelector(
          'input[name="branches.[0].morning.range_high"]',
        )!,
      );
      await user.type(
        container.querySelector(
          'input[name="branches.[0].morning.range_high"]',
        )!,
        '8',
      );

      await user.click(screen.getByRole('button', { name: 'Apply' }));
    });

    expect(setConfiguredHeadways).toHaveBeenCalledWith({
      branch_1: {
        morning: { range_low: 2, range_high: 8 },
        evening: { range_low: 1, range_high: 8 },
      },
      branch_2: {
        morning: { range_low: 2, range_high: 3 },
        evening: { range_low: 1, range_high: 8 },
      },
    });

    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  test('Can cancel edits', async () => {
    const user = userEvent.setup();
    const { container } = render(
      React.createElement(ConfiguredHeadwaysForm, {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      }),
    );

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'edit' }));
      await waitFor(() => {
        expect(container.querySelector('input[disabled]')).toEqual(null);
      });

      await user.type(
        container.querySelector(
          'input[name="branches.[0].morning.range_high"]',
        )!,
        '8',
      );

      expect(
        await screen.findByRole('button', { name: 'Apply' }),
      ).not.toBeDisabled();

      await user.click(screen.getByRole('button', { name: 'cancel' }));
    });
    await waitFor(() => {
      expect(
        (
          container.querySelector(
            'input[name="branches.[0].morning.range_high"]',
          ) as HTMLInputElement
        ).value,
      ).toEqual('3');
    });
    expect(await screen.findByRole('button', { name: 'edit' })).toBeDefined();
    expect(await screen.findByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  test('Invalid headways show error message', async () => {
    const user = userEvent.setup();
    const { container } = render(
      React.createElement(ConfiguredHeadwaysForm, {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      }),
    );

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'edit' }));
      await waitFor(() => {
        expect(container.querySelector('input[disabled]')).toEqual(null);
      });

      await user.type(
        container.querySelector(
          'input[name="branches.[0].morning.range_high"]',
        )!,
        '8',
      );
      await user.type(
        container.querySelector(
          'input[name="branches.[0].morning.range_low"]',
        )!,
        '10',
      );
      await user.tab();
    });

    expect(
      screen.getByText('Error: All headway ranges must be valid.'),
    ).toBeVisible();
  });
});

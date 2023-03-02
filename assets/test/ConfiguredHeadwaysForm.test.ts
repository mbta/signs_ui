import * as React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
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
    const { container } = render(
      React.createElement(ConfiguredHeadwaysForm, {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      }),
    );

    userEvent.type(
      container.querySelector('input[name="branches.[0].morning.range_low"]')!,
      '2',
    );
    userEvent.type(
      container.querySelector('input[name="branches.[0].morning.range_high"]')!,
      '5',
    );
    userEvent.type(
      container.querySelector('input[name="branches.[0].evening.range_low"]')!,
      '2',
    );
    userEvent.type(
      container.querySelector('input[name="branches.[0].evening.range_high"]')!,
      '5',
    );
    userEvent.type(
      container.querySelector('input[name="branches.[1].morning.range_low"]')!,
      '5',
    );
    userEvent.type(
      container.querySelector('input[name="branches.[1].morning.range_high"]')!,
      '10',
    );
    userEvent.type(
      container.querySelector('input[name="branches.[1].evening.range_low"]')!,
      '5',
    );
    userEvent.type(
      container.querySelector('input[name="branches.[1].evening.range_high"]')!,
      '10',
    );

    userEvent.click(screen.getByText('Apply'));

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

  test('Form is initially open', () => {
    renderWrapper();
    expect(screen.getByRole('form')).toBeVisible();
  });

  test('Inputs are initially disabled', () => {
    renderWrapper();

    const inputs = screen.queryAllByRole('input');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('disabled');
    });
  });

  test('Clicking button enables inputs', () => {
    renderWrapper();
    userEvent.click(screen.getByRole('button', { name: 'edit' }));

    const inputs = screen.queryAllByRole('input');
    inputs.forEach((input) => {
      expect(input).not.toHaveAttribute('disabled');
    });
  });

  test('Can apply new values after making edits', async () => {
    const { container } = render(
      React.createElement(ConfiguredHeadwaysForm, {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      }),
    );

    userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await waitFor(() => {
      expect(container.querySelector('input[disabled]')).toEqual(null);
    });

    userEvent.clear(
      container.querySelector('input[name="branches.[0].morning.range_high"]')!,
    );
    userEvent.type(
      container.querySelector('input[name="branches.[0].morning.range_high"]')!,
      '8',
    );

    await waitFor(() => {
      expect(
        (container.querySelector('button#apply') as HTMLButtonElement).disabled,
      ).toEqual(false);
    });

    userEvent.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => {
      expect(container.querySelector('button#edit')).toBeDefined();
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
  });

  test('Can cancel edits', async () => {
    const { container } = render(
      React.createElement(ConfiguredHeadwaysForm, {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      }),
    );

    userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await waitFor(() => {
      expect(container.querySelector('input[disabled]')).toEqual(null);
    });

    userEvent.type(
      container.querySelector('input[name="branches.[0].morning.range_high"]')!,
      '8',
    );
    await waitFor(() => {
      expect(
        (container.querySelector('button#apply') as HTMLButtonElement).disabled,
      ).toEqual(false);
    });

    userEvent.click(screen.getByRole('button', { name: 'cancel' }));
    await waitFor(() => {
      expect(
        (
          container.querySelector(
            'input[name="branches.[0].morning.range_high"]',
          ) as HTMLInputElement
        ).value,
      ).toEqual('3');
      expect(container.querySelector('button#edit')).toBeDefined();
      expect(
        (container.querySelector('button#apply') as HTMLButtonElement).disabled,
      ).toEqual(true);
    });
  });

  test('Invalid headways show error message', async () => {
    const { container } = render(
      React.createElement(ConfiguredHeadwaysForm, {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      }),
    );

    userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await waitFor(() => {
      expect(container.querySelector('input[disabled]')).toEqual(null);
    });

    userEvent.type(
      container.querySelector('input[name="branches.[0].morning.range_high"]')!,
      '8',
    );

    userEvent.type(
      container.querySelector('input[name="branches.[0].morning.range_low"]')!,
      '10',
    );

    await waitFor(() => {
      expect(container.querySelector('.alert-danger')).toEqual(null);
    });

    userEvent.tab();

    await waitFor(() => {
      expect(container.querySelector('.alert-danger')).not.toEqual(null);
    });
  });
});

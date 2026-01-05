import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfiguredHeadwaysForm, {
  ConfiguredHeadwaysFormProps,
} from '../js/ConfiguredHeadwaysForm';

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
    render(
      React.createElement(ConfiguredHeadwaysForm, {
        branches,
        readOnly,
        configuredHeadways,
        setConfiguredHeadways,
        timePeriods,
      }),
    );

    await user.click(screen.getByRole('button', { name: 'edit' }));
    await user.type(screen.getByLabelText('Branch 1 Morning low'), '2');
    await user.type(screen.getByLabelText('Branch 1 Morning high'), '5');
    await user.type(screen.getByLabelText('Branch 1 Evening low'), '2');
    await user.type(screen.getByLabelText('Branch 1 Evening high'), '5');
    await user.type(screen.getByLabelText('Branch Morning low'), '5');
    await user.type(screen.getByLabelText('Branch Morning high'), '10');
    await user.type(screen.getByLabelText('Branch Evening low'), '5');
    await user.type(screen.getByLabelText('Branch Evening high'), '10');

    await user.click(screen.getByRole('button', { name: 'Apply' }));

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
    renderWrapper();
    expect(screen.getByRole('form')).toBeVisible();
  });

  test('Inputs are initially disabled', async () => {
    renderWrapper();

    const inputs = screen.queryAllByRole('input');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('disabled');
    });
  });

  test('Clicking button enables inputs', async () => {
    const user = userEvent.setup();
    renderWrapper();
    await user.click(screen.getByRole('button', { name: 'edit' }));

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

    await user.click(screen.getByRole('button', { name: 'edit' }));
    expect(container.querySelector('input[disabled]')).toEqual(null);

    const input = screen.getByLabelText('Branch 1 Morning high');
    await user.clear(input);
    await user.type(input, '8');

    await user.click(screen.getByRole('button', { name: 'Apply' }));

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

    await user.click(screen.getByRole('button', { name: 'edit' }));
    expect(container.querySelector('input[disabled]')).toEqual(null);

    await user.type(screen.getByLabelText('Branch 1 Morning high'), '8');

    expect(
      await screen.findByRole('button', { name: 'Apply' }),
    ).not.toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'cancel' }));
    expect(screen.getByLabelText('Branch 1 Morning high')).toHaveValue(3);
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

    await user.click(screen.getByRole('button', { name: 'edit' }));
    expect(container.querySelector('input[disabled]')).toEqual(null);

    await user.type(screen.getByLabelText('Branch 1 Morning high'), '8');

    expect(
      screen.queryByText('Error: All headway ranges must be valid.'),
    ).toBeNull();

    await user.type(screen.getByLabelText('Branch 1 Morning low'), '10');

    expect(
      screen.getByText('Error: All headway ranges must be valid.'),
    ).toBeVisible();
  });
});

import * as React from 'react';
import { mount } from 'enzyme';
import { render, waitFor, fireEvent } from '@testing-library/react';
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

const mountWrapper = () =>
  mount(
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

    fireEvent.change(
      container.querySelector('input[name="branches.[0].morning.range_low"]')!,
      { target: { value: '2' } },
    );
    fireEvent.change(
      container.querySelector('input[name="branches.[0].morning.range_high"]')!,
      { target: { value: '5' } },
    );
    fireEvent.change(
      container.querySelector('input[name="branches.[0].evening.range_low"]')!,
      { target: { value: '2' } },
    );
    fireEvent.change(
      container.querySelector('input[name="branches.[0].evening.range_high"]')!,
      { target: { value: '5' } },
    );
    fireEvent.change(
      container.querySelector('input[name="branches.[1].morning.range_low"]')!,
      { target: { value: '5' } },
    );
    fireEvent.change(
      container.querySelector('input[name="branches.[1].morning.range_high"]')!,
      { target: { value: '10' } },
    );
    fireEvent.change(
      container.querySelector('input[name="branches.[1].evening.range_low"]')!,
      { target: { value: '5' } },
    );
    fireEvent.change(
      container.querySelector('input[name="branches.[1].evening.range_high"]')!,
      { target: { value: '10' } },
    );

    await waitFor(() => {
      expect(
        (container.querySelector('button#apply') as HTMLButtonElement).disabled,
      ).toEqual(false);
    });

    fireEvent.click(container.querySelector('button#apply')!);

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
    const wrapper = mountWrapper();

    expect(wrapper.find('form')).toHaveLength(1);
  });

  test('Inputs are initially disabled', () => {
    const wrapper = mountWrapper();
    expect(wrapper.find('input').find({ disabled: true })).toHaveLength(8);
    expect(wrapper.find('input').find({ disabled: false })).toHaveLength(0);
  });

  test('Clicking button enables inputs', () => {
    const wrapper = mountWrapper();
    expect(wrapper.find('input').find({ disabled: true })).toHaveLength(8);
    expect(wrapper.find('input').find({ disabled: false })).toHaveLength(0);
    wrapper.find('button#edit').simulate('click');
    expect(wrapper.find('input').find({ disabled: true })).toHaveLength(0);
    expect(wrapper.find('input').find({ disabled: false })).toHaveLength(8);
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

    fireEvent.click(container.querySelector('button#edit')!);
    await waitFor(() => {
      expect(container.querySelector('input[disabled]')).toEqual(null);
    });

    fireEvent.change(
      container.querySelector('input[name="branches.[0].morning.range_high"]')!,
      { target: { value: '8' } },
    );

    await waitFor(() => {
      expect(
        (container.querySelector('button#apply') as HTMLButtonElement).disabled,
      ).toEqual(false);
    });

    fireEvent.click(container.querySelector('button#apply')!);

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

    fireEvent.click(container.querySelector('button#edit')!);
    await waitFor(() => {
      expect(container.querySelector('input[disabled]')).toEqual(null);
    });

    fireEvent.change(
      container.querySelector('input[name="branches.[0].morning.range_high"]')!,
      { target: { value: '8' } },
    );
    await waitFor(() => {
      expect(
        (container.querySelector('button#apply') as HTMLButtonElement).disabled,
      ).toEqual(false);
    });

    fireEvent.click(container.querySelector('button#cancel')!);
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

    fireEvent.click(container.querySelector('button#edit')!);
    await waitFor(() => {
      expect(container.querySelector('input[disabled]')).toEqual(null);
    });

    fireEvent.change(
      container.querySelector('input[name="branches.[0].morning.range_high"]')!,
      { target: { value: '8' } },
    );

    fireEvent.change(
      container.querySelector('input[name="branches.[0].morning.range_low"]')!,
      { target: { value: '10' } },
    );

    await waitFor(() => {
      expect(container.querySelector('.alert-danger')).toEqual(null);
    });

    fireEvent.blur(
      container.querySelector('input[name="branches.[0].morning.range_low"]')!,
    );

    await waitFor(() => {
      expect(container.querySelector('.alert-danger')).not.toEqual(null);
    });
  });
});

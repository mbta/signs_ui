import React from 'react';
import { mount } from 'enzyme';
import { render, waitFor, fireEvent } from '@testing-library/react';
import MultiSignHeadwayForm from './MultiSignHeadwayForm';

let branches;
let readOnly;
let multiSignHeadwayConfigs;
let setMultiSignHeadwayConfigs;
let unsetMultiSignHeadwayConfigs;
window.confirm = jest.fn(() => true);

beforeEach(() => {
  branches = [{ id: 'branch_1', name: 'Branch 1' }, { id: 'branch_2', name: 'Branch' }];
  setMultiSignHeadwayConfigs = jest.fn(() => {});
  unsetMultiSignHeadwayConfigs = jest.fn(() => {});
  readOnly = false;
  multiSignHeadwayConfigs = {};
});

const mountWrapper = () => mount(React.createElement(MultiSignHeadwayForm, {
  branches,
  readOnly,
  multiSignHeadwayConfigs,
  setMultiSignHeadwayConfigs,
  unsetMultiSignHeadwayConfigs,
}, null));

describe('With Multi-sign Headway not enabled', () => {
  test('Shows "Enable Multi-sign Headways" button', () => {
    const wrapper = mountWrapper();

    expect(wrapper.text()).toMatch('Enable Multi-sign Headways');
  });

  test('Form is initially closed', () => {
    const wrapper = mountWrapper();

    expect(wrapper.find('form')).toHaveLength(0);
  });

  test('Can toggle form open/closed', () => {
    const wrapper = mountWrapper();
    expect(wrapper.find('button.viewer--multi-sign-headway-form-toggle').prop('disabled')).toEqual(false);
    wrapper.find('button.viewer--multi-sign-headway-form-toggle').simulate('click');
    expect(wrapper.find('form')).toHaveLength(1);
    wrapper.find('button.viewer--multi-sign-headway-form-toggle').simulate('click');
    expect(wrapper.find('form')).toHaveLength(0);
  });

  test('Can enable multi-sign headways when form is complete', async () => {
    const { container } = render(React.createElement(MultiSignHeadwayForm, {
      branches,
      readOnly,
      multiSignHeadwayConfigs,
      setMultiSignHeadwayConfigs,
      unsetMultiSignHeadwayConfigs,
    }));

    fireEvent.click(container.querySelector('button.viewer--multi-sign-headway-form-toggle'));
    await waitFor(() => {
      expect(container.querySelector('form')).toBeDefined();
      expect(container.querySelector('input[disabled]')).toEqual(null);
    });

    fireEvent.change(container.querySelector('input[name="items.[0].range_low"]'), {
      target: {
        value: '2',
      },
    });
    fireEvent.change(container.querySelector('input[name="items.[0].range_high"]'), {
      target: {
        value: '5',
      },
    });
    fireEvent.change(container.querySelector('input[name="items.[1].range_low"]'), {
      target: {
        value: '5',
      },
    });
    fireEvent.change(container.querySelector('input[name="items.[1].range_high"]'), {
      target: {
        value: '10',
      },
    });

    await waitFor(() => {
      expect(container.querySelector('button#apply').disabled).toEqual(false);
    });

    fireEvent.click(container.querySelector('input[name="items.[0].non_platform_text_enabled"]'));

    await waitFor(() => {
      expect(container.querySelector('button#apply').disabled).toEqual(true);
      expect(container.querySelector('input[name="items.[0].non_platform_text_line1"]')).toBeDefined();
      expect(container.querySelector('input[name="items.[0].non_platform_text_line1"]').disabled).toEqual(false);
    });

    fireEvent.change(container.querySelector('input[name="items.[0].non_platform_text_line1"]'), {
      target: {
        value: 'Some custom text',
      },
    });

    fireEvent.change(container.querySelector('input[name="items.[0].non_platform_text_line2"]'), {
      target: {
        value: 'More custom text',
      },
    });

    await waitFor(() => {
      expect(container.querySelector('button#apply').disabled).toEqual(false);
    });

    fireEvent.click(container.querySelector('button#apply'));

    await waitFor(() => {
      expect(setMultiSignHeadwayConfigs).toHaveBeenCalledWith({
        branch_1: {
          id: 'branch_1',
          non_platform_text_line1: 'Some custom text',
          non_platform_text_line2: 'More custom text',
          range_high: 5,
          range_low: 2,
        },
        branch_2: {
          id: 'branch_2',
          range_high: 10,
          range_low: 5,
        },
      });
    });
  });
});

describe('With Multi-sign Headway enabled', () => {
  beforeEach(() => {
    multiSignHeadwayConfigs = {
      branch_1: {
        range_low: 2,
        range_high: 3,
      },
      branch_2: {
        range_low: 1,
        range_high: 8,
        non_platform_text_line1: 'Line 1 of custom text',
        non_platform_text_line2: 'Line 2 of custom text',
      },
    };
  });

  test('Shows "Multi-sign Headway Enabled" button if not currently enabled for line', () => {
    const wrapper = mountWrapper();

    expect(wrapper.text()).toMatch('Multi-sign Headways Enableded');
  });

  test('Form is initially open', () => {
    const wrapper = mountWrapper();

    expect(wrapper.find('form')).toHaveLength(1);
  });

  test('Cannot toggle form open/closed', () => {
    const wrapper = mountWrapper();

    expect(wrapper.find('form')).toHaveLength(1);
    expect(wrapper.find('button.viewer--multi-sign-headway-form-toggle').prop('disabled')).toEqual(true);
    wrapper.find('button.viewer--multi-sign-headway-form-toggle').simulate('click');
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
    const { container } = render(React.createElement(MultiSignHeadwayForm, {
      branches,
      readOnly,
      multiSignHeadwayConfigs,
      setMultiSignHeadwayConfigs,
      unsetMultiSignHeadwayConfigs,
    }));

    fireEvent.click(container.querySelector('button#edit'));
    await waitFor(() => {
      expect(container.querySelector('input[disabled]')).toEqual(null);
    });

    fireEvent.change(container.querySelector('input[name="items.[0].range_high"]'), {
      target: {
        value: '8',
      },
    });

    fireEvent.click(container.querySelector('input[name="items.[0].non_platform_text_enabled"]'));

    await waitFor(() => {
      expect(container.querySelector('input[name="items.[0].non_platform_text_line1"]')).toBeDefined();
      expect(container.querySelector('input[name="items.[0].non_platform_text_line1"]').disabled).toEqual(false);
    });
    fireEvent.change(container.querySelector('input[name="items.[0].non_platform_text_line1"]'), {
      target: {
        value: 'Some custom text',
      },
    });

    await waitFor(() => {
      expect(container.querySelector('button#apply').disabled).toEqual(false);
    });

    fireEvent.click(container.querySelector('button#apply'));

    await waitFor(() => {
      expect(container.querySelector('button#edit')).toBeDefined();
    });

    expect(setMultiSignHeadwayConfigs).toHaveBeenCalledWith({
      branch_1: {
        id: 'branch_1',
        range_low: 2,
        range_high: 8,
        non_platform_text_line1: 'Some custom text',
      },
      branch_2: {
        id: 'branch_2',
        range_low: 1,
        range_high: 8,
        non_platform_text_line1: 'Line 1 of custom text',
        non_platform_text_line2: 'Line 2 of custom text',
      },
    });
  });

  test('Can cancel edits', async () => {
    const { container } = render(React.createElement(MultiSignHeadwayForm, {
      branches,
      readOnly,
      multiSignHeadwayConfigs,
      setMultiSignHeadwayConfigs,
      unsetMultiSignHeadwayConfigs,
    }));

    fireEvent.click(container.querySelector('button#edit'));
    await waitFor(() => {
      expect(container.querySelector('input[disabled]')).toEqual(null);
    });

    fireEvent.change(container.querySelector('input[name="items.[0].range_high"]'), {
      target: {
        value: '8',
      },
    });
    await waitFor(() => {
      expect(container.querySelector('button#apply').disabled).toEqual(false);
    });

    fireEvent.click(container.querySelector('button#cancel'));
    await waitFor(() => {
      expect(container.querySelector('input[name="items.[0].range_high"]').value).toEqual('3');
      expect(container.querySelector('button#edit')).toBeDefined();
      expect(container.querySelector('button#apply').disabled).toEqual(true);
    });
  });

  test('Can click "Disable" button', () => {
    const wrapper = mountWrapper();
    wrapper.find('button#disable').simulate('click');
    expect(unsetMultiSignHeadwayConfigs).toHaveBeenCalledWith(branches.map(branch => branch.id));
  });
});

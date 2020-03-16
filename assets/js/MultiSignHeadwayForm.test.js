import React from 'react';
import { mount } from 'enzyme';
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

  test('Can click "Disable" button', () => {
    const wrapper = mountWrapper();
    wrapper.find('button#disable').simulate('click');
    expect(unsetMultiSignHeadwayConfigs).toHaveBeenCalledWith(branches.map(branch => branch.id));
  });
});

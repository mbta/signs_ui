import React from 'react';
import { mount } from 'enzyme';

import ViewerApp from "./ViewerApp";

test("ViewerApp renders", () => {
  const signs = { "signID": ["top content", "bottom content"] };
  const wrapper = mount(<ViewerApp initialSigns={signs} />);
  expect(wrapper.text()).toMatch("signID");
  expect(wrapper.text()).toMatch("top content");
  expect(wrapper.text()).toMatch("bottom content");
});

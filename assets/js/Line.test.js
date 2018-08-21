import React from 'react';
import { mount } from 'enzyme';

import Line from './Line';

test('Shows all signs for a line', () => {
  const now = Date.now();
  const fresh = new Date(now + 5000).toLocaleString();
  const signs = { signID: [{ text: 'Alewife 1 min', duration: fresh }, { text: 'Alewife 3 min', duration: fresh }] };

  const currentTime = now + 2000;
  const line = 'Red';

  const wrapper = mount(React.createElement(Line, { signs, currentTime, line }, null));

  expect(wrapper.text()).toMatch('RALE-cRALE-mRDAV-mRDAV-nRDAV-sRPOR-mRPOR-nRPOR-sRHAR-mRHAR-nRHAR-sRCEN-nRCEN-sRKEN-nRKEN-sRMGH-nRMGH-sRPRK-nRPRK-sRPRK-cRDTC-nRDTC-sRSOU-mRSOU-nRSOU-sSSOU-mRBRO-mRBRO-nRBRO-sRAND-mRAND-nRAND-sRSAV-mRSAV-nRSAV-sRFIE-mRFIE-nRFIE-sRSHA-mRSHA-nRSHA-sRASH-mRASH-nRNQU-mRNQU-nRNQU-sRWOL-mRWOL-nRWOL-sRQUC-mRQUC-nRQUC-sRQUA-mRQUA-nRQUA-sRBRA-cRBRA-mRJFK-wRJFK-sRJFK-eRJFK-nRJFK-m');
  expect(wrapper.text()).not.toMatch('OOAK');
});
